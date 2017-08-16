// Packages imports
const Wampy = require('wampy').Wampy

// Modules Imports
const CONFIG = require('./config/config.js')

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
module.exports.dispatcher = require('./disptacher/dispatcher.js')

// Exports connection object
module.exports.mongo = require('./mongo/mongo.js')()

// Exports disptcher module
module.exports.watcher = require('./watcher/watcher.js')
