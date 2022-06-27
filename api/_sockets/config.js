module.exports = {
  port: 1338,
  options: {
    idleTimeout: 30000,
    maxBackpressure: 1024,
    maxPayloadLength: 512,
    // keepAlive: {
    //   interval: 20000,
    //   timeout: 3000,
    // }
    keepAlive: false,
  }
}