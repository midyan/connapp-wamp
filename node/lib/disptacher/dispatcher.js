// Import Modules
const INDEX = require('../../index.js')

// Import Packages
const _ = require('lodash')

// Define helper variables
const ws = INDEX.connection

/**
 * Function to dispatch event whenever a document is updated on MongoDB.
 * @param  {String} type      Type of action. e.g. Update, New, Delete, Fetch
 * @param  {String} model     Mongoose model the function was dispatched from
 * @param  {String} _id       ID of the documento to perform publish
 * @param  {Object} [data={}] Updated data to send
 */
const dispatchRealtime = (type, model, _id, data = {}) => {
  // Builds event string
  const event = _.compact(['connapp', model, type, _id]).join('.')

  // Adds extra info to the data, so the App can update the right document
  const data.meta = {
    type: type,
    model: model,
    _id: _id
  }

  // Publish the event
  connection.publish(event, data)
}

// Exports
module.exports = {
  dispatcher: dispatcher
}
