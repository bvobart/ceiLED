#!/bin/sh
# Generates a JSON configuration for Caddy
# Depends on envsubst and jq
# 
# Environment variables:
# - SITE_ADDRESS: See Dockerfile or ReadMe
# - API_ADDRESS: See Dockerfile or ReadMe
# - SERVER_ADDRESS: See Dockerfile or ReadMe
# - SITE_ACCESS_POLICY: lan or public. If 'lan' (or anything else than 'public'), any requests from IPs outside of the LAN will be blocked. Defaults to 'lan'
# - API_ACCESS_POLICY: lan or public. If 'lan' (or anything else than 'public'), any requests from IPs outside of the LAN will be blocked. Defaults to 'lan'

cd "$(dirname "$0")"

# Utils
source ./utils.sh
startup_check() {
  [[ -z "${API_ADDRESS}" ]] && fail "API_ADDRESS not defined"
  [[ -z "${SITE_ADDRESS}" ]] && fail "SITE_ADDRESS not defined"
  [[ -z "${SERVER_ADDRESS}" ]] && fail "SERVER_ADDRESS not defined"
  [[ -z "${SITE_ACCESS_POLICY}" || "${SITE_ACCESS_POLICY}" != "public" ]] && export SITE_ACCESS_POLICY="lan"
  [[ -z "${API_ACCESS_POLICY}" || "${API_ACCESS_POLICY}" != "public" ]] && export API_ACCESS_POLICY="lan"
}
# End Utils



# Start of actual script
startup_check

export SITE_PORT="$(parse_port ${SITE_ADDRESS})"
export SITE_HOST="$(parse_host ${SITE_ADDRESS})"
export API_PORT="$(parse_port ${API_ADDRESS})"
export API_HOST="$(parse_host ${API_ADDRESS})"

# Auto HTTPS is off when either the site or API address defines a port, 
# or when either one of them or both are local addresses
# or when either one of them or both are localhost, 
# since HTTPS on localhost is still a bitch to get working
autoHttps="on"
if [[ "${API_PORT}" != "" || "${SITE_PORT}" != "" ]] \
   || is_local_address "${SITE_ADDRESS}" \
   || is_local_address "${API_ADDRESS}" \
   || is_localhost "${SITE_ADDRESS}" \
   || is_localhost "${API_ADDRESS}"
then
  autoHttps="off"
fi

# If not explicitly defined, set SITE_PORT to 443 or 80 depending on whether autoHTTPS is on. 
if [[ "${SITE_PORT}" == "" ]] && [[ "$autoHttps" == "on" ]]; then
  export SITE_PORT="443"
elif [[ "${SITE_PORT}" == "" ]]; then
  export SITE_PORT="80"
fi

# If not explicitly defined, set API_PORT to 443 or 80 depending on whether autoHTTPS is on. 
if [[ "${API_PORT}" == "" ]] && [[ "$autoHttps" == "on" ]]; then
  export API_PORT="443"
elif [[ "${API_PORT}" == "" ]]; then
  export API_PORT="80"
fi

# Set CORS header
export API_CORS="https://${SITE_ADDRESS}"
if [[ "$autoHttps" == "off" ]]; then
  export API_CORS="http://${SITE_ADDRESS}"
fi

# if SITE_PORT == API_PORT, then use the template-same-port.json. 
if [[ "${API_PORT}" == "${SITE_PORT}" ]]; then
  output=$(cat ./template-same-port.json | envsubst)
  # remove block on public IPs if access policy is public.
  [[ "${SITE_ACCESS_POLICY}" == "public" ]] && output=$(echo "$output" | jq 'del(.apps.http.servers.srv0.routes[1].handle[0].routes[1])')
  [[ "${API_ACCESS_POLICY}" == "public" ]] && output=$(echo "$output" | jq 'del(.apps.http.servers.srv0.routes[0].handle[0].routes[0])')
  # disable auto HTTPS explicitly
  [[ "$autoHttps" == "off" ]] && output=$(echo "$output" | jq '.apps.http.servers.srv0 += {automatic_https: {disable: true}}')
else
  output=$(cat ./template.json | envsubst)
  # remove block on public IPs if access policy is public.
  [[ "${SITE_ACCESS_POLICY}" == "public" ]] && output=$(echo "$output" | jq 'del(.apps.http.servers.srv0.routes[0].handle[0].routes[0])')
  [[ "${API_ACCESS_POLICY}" == "public" ]] && output=$(echo "$output" | jq 'del(.apps.http.servers.srv1.routes[0].handle[0].routes[0])')
  # disable auto HTTPS explicitly
  [[ "$autoHttps" == "off" ]] && output=$(echo "$output" | jq '.apps.http.servers.srv0 += {automatic_https: {disable: true}}' | jq '.apps.http.servers.srv1 += {automatic_https: {disable: true}}')
fi

# Print formatted output
echo $output | jq .

# Print some debug info to stderr. These will end up in the docker-compose logs, but not in the config.
echo_err ".-----------------------------------"
echo_err "|     CeiLED Web - Caddy config"
echo_err "|-> Website Host: ${SITE_HOST} - Port: ${SITE_PORT} - Access: ${SITE_ACCESS_POLICY}"
echo_err "|-> API Host: ${API_HOST} - Port: ${API_PORT} - Access: ${API_ACCESS_POLICY}"
echo_err "|-> API CORS: $API_CORS"
echo_err "|-> AutoHTTPS: $autoHttps" 
echo_err "'-----------------------------------"



#--------------------------------------------------------------------------------
# What will be generated is basically a JSON version of what is written below.
# {
#   admin off
# }


# {$SITE_ADDRESS} {
#   encode zstd gzip

#   # Deny access to any connection not from LAN or localhost.
#   @not_lan {
#     not remote_ip 127.0.0.1 127.0.1.1 192.168.0.0/16 172.16.0.0/12 10.0.0.0/8
#   }
#   respond @not_lan 403

#   file_server {
#     root /app/public
#   }
# }

# {$API_ADDRESS} {
#   log {
#     output stdout
#     format console
#   }

#   # Deny access to any connection not from LAN or localhost.
#   @not_lan {
#     not remote_ip 127.0.0.1 127.0.1.1 192.168.0.0/16 172.16.0.0/12 10.0.0.0/8
#   }
#   respond @not_lan 403

#   # reverse proxy to ceiled-server
#   reverse_proxy {$SERVER_ADDRESS} {
#     header_up Host {host}
#     header_up X-Real-IP {remote_host}
#     header_up X-Forwarded-For {remote_host}
#     header_up X-Forwarded-Proto {scheme}
#     header_down Access-Control-Allow-Origin http://{$SITE_ADDRESS}
#   }
# }
