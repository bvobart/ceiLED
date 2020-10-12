# Alpine Rust builder image
FROM rust:alpine as builder
WORKDIR /app

RUN apk add musl-dev
COPY ./ /app
RUN cargo build --release

# Alpine production image
FROM alpine:latest
WORKDIR /app

COPY --from=builder /app/target/release/ceiled-driver ./ceiled-driver
CMD ./ceiled-driver $ARGS
