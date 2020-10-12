# NodeJS builder image
FROM node:lts-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build static website
COPY tsconfig.json README.md ./
COPY public ./public
COPY src ./src
RUN yarn build

# ---

# Caddy server as deployment image
FROM caddy:2.1.1-alpine
WORKDIR /app

RUN apk --no-cache add jq gettext nodejs npm
RUN npm install --global @beam-australia/react-env

COPY caddy ./caddy
COPY --from=builder /app/build ./public

# -----------------------
# Environment Variables
# -----------------------

# SITE_ADDRESS is the address on which ceiled-web will be hosted. 
# Per default, if this is a public domain name, Caddy will try to acquire 
# an SSL certificate for this domain through LetsEncrypt.
# Must be a domain that your clients can access.
ENV SITE_ADDRESS='localhost'

# API_ADDRESS is the address on which the API will be hosted. 
# Caddy will also try to get an SSL certificate for this domain through LetsEncrypt, if it is a public domain.
# ceiled-web by default assumes 'api.' + window.location.host, i.e. 'api.' + SITE_ADDRESS
# Must be a domain that your clients can access. 
ENV API_ADDRESS='api.localhost'

# SERVER_ADDRESS is an address pointing to a running ceiled-server instance. Must be reachable from within this Docker container.
ENV SERVER_ADDRESS='localhost:6565'

# Per default, Caddy limits access to both the website and API to only allow clients coming from within your LAN.
# Set one or both of these to 'public' to allow the website and / or API to be accessed publically.
ENV SITE_ACCESS_POLICY='lan' API_ACCESS_POLICY='lan'

# -----------------------

CMD echo "REACT_APP_API_ADDRESS=${API_ADDRESS}" > .env \
    && react-env --dest ./public \
    && ./caddy/build-config.sh > caddy-config.json \
    && caddy run --environ --config caddy-config.json
