# Install dependencies
FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


# Build NextJS website
FROM node:16-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
# TODO: start using a src directory to only need to copy src and public
COPY . .
RUN yarn build

# ---

# Copy NextJS static website and run Caddy to manage automatic HTTPS, web traffic ingress and routing to API.
FROM node:16-alpine as runner
WORKDIR /app

RUN apk --no-cache add jq gettext caddy
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 && chown 1001:1001 .

COPY scripts ./scripts
COPY package.json yarn.lock /app/

COPY --from=deps /app/node_modules /app/node_modules
RUN yarn install --frozen-lockfi1le --prefer-offline --production

COPY --from=builder --chown=nextjs:nodejs /app/out /app/public

USER 1001:1001

# -----------------------
# Environment Variables
# -----------------------

ENV NODE_ENV='production'
ENV NEXT_TELEMETRY_DISABLED=1

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

CMD ./scripts/docker-cmd.sh
