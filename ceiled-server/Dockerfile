FROM node:12-alpine as builder
WORKDIR /app

COPY yarn.lock package.json ./
RUN yarn install --frozen-lockfile
COPY tsconfig.json ./
COPY src ./src
RUN yarn build

FROM node:12-alpine
WORKDIR /app

COPY yarn.lock package.json ./
RUN yarn install --frozen-lockfile --production
COPY --from=builder /app/build .

CMD node server.js
