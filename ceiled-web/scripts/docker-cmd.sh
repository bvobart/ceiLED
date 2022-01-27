#!/bin/sh

# Exit on first error
set -e

# Inject run-time environment variables
echo "REACT_APP_API_ADDRESS=${API_ADDRESS}" > .env
yarn react-env --dest ./public

# Launch Caddy for ingress
./scripts/caddy/build-config.sh > caddy-config.json
caddy run --environ --config caddy-config.json
