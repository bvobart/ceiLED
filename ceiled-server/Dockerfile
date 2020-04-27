FROM node:12-alpine as build

WORKDIR /app/ceiled-server

COPY ./yarn.lock ./yarn.lock
COPY ./package.json ./package.json
RUN yarn install --frozen-lockfile

COPY ./tsconfig.json ./tsconfig.json
COPY ./src ./src
RUN yarn build

FROM node:12-alpine
WORKDIR /app

COPY ./package.json ./package.json
RUN yarn install --frozen-lockfile --production

COPY --from=build /app/ceiled-server/build ./build

CMD node build/server.js
