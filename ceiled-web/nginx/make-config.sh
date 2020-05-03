#!/bin/sh
# Generates an Nginx config based on a number of environment variables.
# Outputs the generated config to the filename given as first argument
#
# Environment variables:
# - PUBLIC_URI: the URI on which ceiled-web will be hosted. May either be a single url or multiple separated by spaces.
#   > Examples: "bart.vanoort.is", "bart.vanoort.is www.bart.vanoort.is ceiled.bart.vanoort.is www.ceiled.bart.vanoort.is"
# - SERVER_URI: the URI of the ceiled-server instance that hosts the API, relative to where Nginx is running.
#   > Example: "localhost:6565"
# - SSL_CERT: the location of the SSL certificate file.
#   > Example: "/etc/letsencrypt/live/bart.vanoort.is/fullchain.pem;"
# - SSL_KEY: the location of the SSL certificate key file
#   > Example: "/etc/letsencrypt/live/bart.vanoort.is/privkey.pem;"
# - SSL_INCLUDE: the location of a file to be included in this config, containing extra SSL options
#   > Example: "/etc/letsencrypt/options-ssl-nginx.conf"
# - SSL_DHPARAM: the location of a file from which to import the DH parameters.
#   > Example: "/etc/letsencrypt/ssl-dhparams.pem"
#
# For SSL to be configured, all of { SSL_CERT, SSL_KEY, SSL_INCLUDE, SSL_DHPARAM } must be provided. 
# Then port 443 will host ceiled-web and port 80 will redirect to port 443.
# If any of these SSL parameters is not set, then ceiled-web will be hosted on port 80.  

set -e

if [ -z "$PUBLIC_URI" ]; then
  echo "Error: PUBLIC_URI not set"
  exit 1
fi

if [ -z "$SERVER_URI" ]; then
  echo "Error: SERVER_URI not set"
  exit 1
fi

# Write the configuration template to the file
cat << EOF
gzip on;
gzip_types text/plain application/xml application/javascript;

upstream ceiled-api {
  ip_hash;
  server ${SERVER_URI};
}

# Server for the ceiled-web website and CeiLED controller API.
server {
  server_name ${PUBLIC_URI};

  index index.html;
  root /usr/share/nginx/html;
  error_log /var/log/nginx/error.ceiled.log;
  access_log /var/log/nginx/access.ceiled.log;

  location / {
    try_files \$uri \$uri/ /index.html;
  }

  # Media: images, icons, video, audio, HTC
  location ~* \.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc)$ {
    expires 1M;
    access_log off;
    add_header Cache-Control "public";
  }

  # Javascript and CSS files: TODO: fix cache-control
  location ~* \.(?:css|js)$ {
    try_files \$uri =404;
    access_log off;
    add_header Cache-Control no-cache;
    add_header X-Cache-Status \$upstream_cache_status;
  }

  # Any route containing a file extension (e.g. /devicesfile.js)
  location ~ ^.+\..+$ {
    try_files \$uri =404;
  }
  
  # Allow WebSocket connections to ceiled-server
  location /ceiled-api {
    proxy_pass https://ceiled-api;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header Host \$host;
    proxy_http_version 1.1;

    proxy_connect_timeout 7d;
    proxy_read_timeout 7d;
    proxy_send_timeout 7d;

    error_log /var/log/nginx/error.ceiled-api.log;
    access_log /var/log/nginx/access.ceiled-api.log;
    
    # allow 80.112.154.48; # Home IP address
    # allow 192.168.0.0/24; # IPv4 addresses within home network
    # allow fe80::/10; # IPv6 addresses within home network
    deny all;
  }

EOF

# If no SSL certificate, then finish the config.
if [ -z "$SSL_CERT" ] || [ -z "$SSL_KEY" ] || [ -z "$SSL_INCLUDE" ] || [ -z "$SSL_DHPARAM" ]; then
  cat << EOF
  listen 80;
  listen [::]:80;
}
EOF
  exit 0
fi

# Otherwise continue writing SSL options, also enable HTTP/2 when using SSL.
cat << EOF
  listen [::]:443 ssl http2 ipv6only=on;
  listen 443 ssl http2;
  ssl_certificate ${SSL_CERT};
  ssl_certificate_key ${SSL_KEY};
  include ${SSL_INCLUDE};
  ssl_dhparam ${SSL_DHPARAM};
  # ssl_certificate /etc/letsencrypt/live/bart.vanoort.is/fullchain.pem;
  # ssl_certificate_key /etc/letsencrypt/live/bart.vanoort.is/privkey.pem;
  # include /etc/letsencrypt/options-ssl-nginx.conf;
  # ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

# Listen to all traffic on port 80 and redirect to HTTPS at port 443
server {
EOF

# Print once for every server name
for name in $PUBLIC_URI; do
  cat << EOF
  if (\$host = ${name}) {
    return 301 https://\$host\$request_uri;
  }

EOF
done

# finish printing the config file
cat << EOF
  listen 80;
  listen [::]:80;
  server_name ${PUBLIC_URI};
  return 404;
}
EOF
