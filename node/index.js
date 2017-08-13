// Modules Imports
const CONFIG = require('./config/config.js')
const DISPATCHER = require('./lib/dispatcher/dispatcher.js')
const MONGO = require('./lib/mongo/mongo.js')()

// Packages imports
const Wampy = require('wampy').Wampy

// Exports Config object
module.exports.CONFIG = CONFIG

// Websockets options
const wsOptions = {
  ws: CONFIG.WEBSOCKET.CLIENT,
  realm: CONFIG.WEBSOCKET.REALM
}

// Exports connection object
module.exports.connection = new Wampy(CONFIG.WEBSOCKET.URL, wsOptions)

// Exports disptcher module
module.exports.dispatcher = DISPATCHER

// Exports connection object
module.exports.mongo = MONGO
