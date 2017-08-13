// Impots and packages
const CONFIG = require('./config/config.js')
const WEBSOCKET = CONFIG.WEBSOCKET
const Wampy = require('wampy').Wampy

// Websockets options
const wsOptions = {
  ws: WEBSOCKET.CLIENT,
  realm: WEBSOCKET.REALM
}

// Builds connections objetct
const connection = new Wampy(WEBSOCKET.URL)

// Exports Config object
module.exports.CONFIG = CONFIG

//  Exports connection object
module.exports.connection = connection
