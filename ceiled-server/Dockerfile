FROM node:10-alpine as build

WORKDIR /app/ceiled-server

COPY ./yarn.lock ./yarn.lock
COPY ./package.json ./package.json
RUN yarn install

COPY ./tsconfig.json ./tsconfig.json
COPY ./src ./src
RUN yarn build

FROM node:10-alpine
WORKDIR /app

COPY ./package.json ./package.json
RUN yarn install --production

COPY --from=build /app/ceiled-server/build ./build

CMD node build/server.js
