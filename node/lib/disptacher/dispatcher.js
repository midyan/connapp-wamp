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
const insertToApp = (model, data = {}, length = undefined) => {
  // Builds event string
  const event = `connapp.app.${model.toLowerCase()}.insert`

  // Publish the event
  ws.publish(
    event,
    [data, length]
  )

  console.log(event + ' was published ' + length)
}

// FUnction to tell the App to update local documento o model
const updateDocumentToApp = (model, _id, data = {}) => {
  // Builds event string
  const event = `connapp.app.${model.toLowerCase()}.update.${_id}`
  // console.log(event, data)
  // Publish the event
  ws.publish(
    event,
    [data]
  )

  console.log(event + ' was published')

}

// Exports
module.exports = {
  insertToApp: insertToApp,
  updateDocumentToApp: updateDocumentToApp
}
