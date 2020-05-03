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

# Nginx deployment image
FROM nginx:alpine
WORKDIR /app

# URI of a running ceiled-server instance.
ENV PUBLIC_URI='localhost'
ENV SERVER_URI='localhost:6565'
# TODO: figure out how to apply LetsEncrypt SSL params
# TODO: figure out a way to split production from staging environments

COPY nginx/make-config.sh .
COPY --from=builder /app/build /usr/share/nginx/html
CMD sh make-config.sh > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'
