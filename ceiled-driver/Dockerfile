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

# The driver socket will be available at /app/socket/ceiled.sock
# Mount a volume ot /app/socket to share it with ceiled-server
ENTRYPOINT ["./ceiled-driver", "--socketFile /app/socket/ceiled.sock"]
# Per default, the driver starts with the debug driver, but this can be overriden to enable other devices.
CMD --debug
