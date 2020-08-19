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

ARG api_address
RUN REACT_APP_API_ADDRESS=${api_address} yarn build

# ---

# Caddy server as deployment image
FROM caddy:2.1.1-alpine
WORKDIR /app
ARG api_address

RUN apk --no-cache add jq gettext
COPY caddy ./caddy
COPY --from=builder /app/build ./public

# -----------------------
# Environment Variables
# -----------------------

# SITE_ADDRESS is an address, or comma separated list of addresses, on which ceiled-web will be hosted. 
# Per default, Caddy will try to acquire SSL certificates for these addresses through LetsEncrypt, 
# or something something act as its own Root CA when using addresses such as localhost.
# You can also disable HTTPS and only use HTTP by specifying port 80, e.g. localhost:80
# Must be a domain that your clients can access.
ENV SITE_ADDRESS='localhost:80'

# API_ADDRESS is a single address on which the API will be hosted. Caddy will also try to get an SSL certificate for this domain
# ceiled-web by default assumes 'api.' + window.location.host, i.e. 'api.' + SITE_ADDRESS
# Must be a domain that your clients can access. Caddy will limit access to only clients coming from within your LAN. 
ENV API_ADDRESS=${api_address}

# SERVER_ADDRESS is an address pointing to a running ceiled-server instance. Must be reachable from within this Docker container.
ENV SERVER_ADDRESS='localhost:6565'

# -----------------------


CMD ./caddy/build-config.sh > caddy-config.json && caddy run --environ --config caddy-config.json
