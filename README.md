# ceiLED

Repository for the software written in order to control the LED strips on my room's ceiling. See the individual folders for instructions on how to launch.

You can use `npm install` to install the dependencies of both the controller and the web interface at the same time.

## Secure WebSockets

On this branch, the web application is configured to connect to a `wss://` address, i.e. a secure WebSocket. The controller is also configured to host a `wss://` address, but it will need a valid SSL certificate in order to host its HTTPS server.

To provide a valid key and certificate file, use the following environment variables for the controller:

Environment variable | Default value        | Meaning
---------------------|----------------------|---------
`KEY_FILE`           | `localhost.key.pem`  | Location of the PEM file defining the private key (relative to controller folder).
`CERT_FILE`          | `localhost.cert.pem` | Location of the PEM file defining the certificate (relative to controller folder).
