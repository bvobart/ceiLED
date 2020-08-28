FROM rust:latest as builder

RUN apt-get update && apt-get install musl-tools -y
RUN rustup target add x86_64-unknown-linux-musl

# cache dependencies
WORKDIR /usr/src
RUN USER=root cargo new --bin ceiled-driver
WORKDIR /usr/src/ceiled-driver
COPY ./Cargo.toml ./Cargo.toml
RUN RUSTFLAGS=-Clinker=musl-gcc cargo build --release --target=x86_64-unknown-linux-musl

# clean and build source code
RUN rm src/*.rs && rm ./target/x86_64-unknown-linux-musl/release/deps/ceiled_driver*
COPY ./build.rs ./build.rs
COPY ./src ./src
RUN RUSTFLAGS=-Clinker=musl-gcc cargo build --release --target=x86_64-unknown-linux-musl

# then copy the built file into run container
FROM alpine:latest
WORKDIR /app

COPY --from=builder /usr/src/ceiled-driver/target/x86_64-unknown-linux-musl/release/ceiled-driver ./ceiled-driver

CMD ./ceiled-driver $ARGS
