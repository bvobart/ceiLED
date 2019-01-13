# ceiLED

Repository for the software written in order to control the LED strips on my room's ceiling. The software consists of a TypeScript NodeJS `controller` that hosts the JSON WebSocket API, and a ReactJS web interface `ceiled-web` that serves as a remote control for displaying cool RGB colour patterns on the LED strips.

You can use `yarn install` in this folder to install the dependencies of both the controller and the web interface at the same time.

## SSL Certificates

`ceiled-web` is configured to connect to a `wss://` address in production, i.e. a secure WebSocket. This means that the `controller` instance running at the address should also be hosting a secure WebSocket connection. In the development environment however, `ceiled-web` will connect to a `ws://` address, since valid SSL in a development environment is just a severe pain in the ass...  

The controller is by default configured to host a `wss://` address, for which it will need a valid SSL certificate. The environment variable `INSECURE` can be set to make the server host an insecure `ws://` server instead, which is particularly helpful in development.

To provide a valid key and certificate file, use the following environment variables for the `controller`:

Environment variable | Default value        | Meaning
---------------------|----------------------|---------
`KEY_FILE`           | `localhost.key.pem`  | Location of the PEM file defining the private key (relative to controller folder).
`CERT_FILE`          | `localhost.cert.pem` | Location of the PEM file defining the certificate (relative to controller folder).
