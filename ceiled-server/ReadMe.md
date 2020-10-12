# ceiled-server

WebSocket server for the `ceiled-web` UI in order to display patterns on LED devices connected through `ceiled-driver`. It hosts the JSON WebSocket API and interfaces with the LED strips through the the ceiled-driver's Unix socket. It also connects to a MongoDB database containing all whitelisted authentication tokens that are allowed to perform requests to change the lights.

## Quick Start

This software can be run on any computer that supports NodeJS or Docker.

### From source

1. Have NodeJS, preferably v12
2. Have a MongoDB instance running.
3. Have a running instance of `ceiled-driver`
4. `yarn install`
5. `yarn start`

### Docker

- `docker build -t ceiled-server .`
- `docker run ceiled-server`

Be sure to mount a volume with the driver's `ceiled.sock` file in it to `/app/ceiled-driver/`.

## Environment variables

| Name            | Default value                  | Description                                                                   |
| --------------- | ------------------------------ | ----------------------------------------------------------------------------- |
| `PORT`          | `6565`                         | Port to host the WebSocket API on                                             |
| `INSECURE`      | `false`                        | Whether to host the WebSocket over HTTP (`true`) or HTTPS (`false`)           |
| `KEY_FILE`      | `localhost.key.pem`            | HTTPS certificate private key location, relative to this directory.           |
| `CERT_FILE`     | `localhost.cert.pem`           | HTTPS certificate public key location, relative to this directory.            |
| `CEILED_SOCKET` | `../ceiled-driver/ceiled.sock` | Location of the `ceiled-driver` Unix socket file, relative to this directory. |
| `DB_HOST`       | `localhost:27017`              | Address of the MongoDB database used for the authentication of requests.      |
| `DB_AUTH`       | `admin`                        | Name of database to authenticate the MongoDB connection with.                 |
| `DB_NAME`       | `ceiled`                       | Name of the database to use for data.                                         |
| `DB_USERNAME`   |                                | Username to authenticate to MongoDB with                                      |
| `DB_PASSWORD`   |                                | Password to authenticate to MongoDB with                                      |

## Verifying that API is up

Either launch ceiled-web and try to connect, or use the command below. Requires NodeJS and NPM / NPX to be installed.

```
npx wscat -c ws://hostname:port/socket.io/\?transport=websocket
```

Output should be something like:

```
Connected (press CTRL+C to quit)
< 0{"sid":"uTPa4zYoDJ8LX4R5AAAC","upgrades":[],"pingInterval":25000,"pingTimeout":5000}
< 40
>
```

(Source)[https://stackoverflow.com/questions/60212309/curl-request-for-socket-io-on-node-express]
