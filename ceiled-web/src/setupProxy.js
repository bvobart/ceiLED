const proxy = require("http-proxy-middleware")

/**
 * Sets up react-scripts to allow proxying of API requests to controller.
 */
module.exports = app => {
  app.use(proxy("/ceiled-api", { 
    target: "http://localhost:6565", 
    ws: true
  }))
}
