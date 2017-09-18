// Import Modules
const INDEX = require('../../index.js')

// Import Packages
const _ = require('lodash')
const merge = require('merge')

// Define helper variables
const ws = INDEX.connection
const mongo = INDEX.mongo
const dispatcher = INDEX.dispatcher

/**
 * Function to watch for updates on all collections
 */
const watchUpdates = () => {
  for (var model in mongo.models) {
    ws.subscribe(`connapp.server.${model.toLowerCase()}.update`, function(data) {
      mongo.models[model]
      .findOne({_id: data._id}).exec()
      .then(res => {
        if (!res) return false
        // deletes save so it won't conflict on merging
        delete res.save

        // merges with new data
        merge(res, data)

        // Makes sure this is treated as an update by the post save hook
        res.isNew = false

        // saves Updated item
        return res.save()
      })
      .then(res => {
        // console.log(res)
      })
      .catch(err => console.log(err))
    })
  }
}

/**
 * Function to watch for inserts on all collections
 */
const watchInserts = () => {
  for (var model in mongo.models) {
    ws.subscribe(`connapp.server.${model.toLowerCase()}.insert`, function(data) {
      let doc = new mongo.models[model](data)

      // Make sure this is treated as new by the post-save hook
      doc.isNew = true

      doc.save()
        .then(res => {
          // console.log(res)
        })
        .catch(err => console.log(err))
    })
  }
}

/**
 * Function to watch for inserts on all collections
 */
const watchSync = () => {
  Object.keys(mongo.models).forEach(model => {
    const Model = mongo.models[model]
    const uri = `connapp.server.${model.toLowerCase()}.fetch`
    // console.log(uri)
    ws.subscribe(uri, (args, kwargs) => {
      // console.log(args)
      const sentData = (((args.argsDict || {}).data || [])[0] || {})
      const ids = sentData.argsList
      const mobileQuery = sentData.argsDict

      // console.log(uri+' was triggered')

      Model
        .find(mobileQuery).exec()
        .then(data => {
          // console.log(data)
          // If nothing is found, does nothing
          if (!data.length) return true

          // console.log(ids)
          // Loops through the found data and dispatch route accordingly
          data.forEach(item => {
            const _id = item._id.toString()
            if ( ids.indexOf(_id) == -1 ) {
              dispatcher.insertToApp(model, item, data.length)
            } else {
              // console.log(item)
              dispatcher.updateDocumentToApp(model, _id, item)
            }
          })
	      })
        .catch(err => console.log(err))
    })
  })
}

const watchersObj = {
  watchUpdates: watchUpdates,
  watchInserts: watchInserts,
  watchSync: watchSync
}

const runAllWatchers = () => _.mapValues(
  watchersObj,
  watcher => {
    var status = true

    try {
      watcher()
    } catch(e) {
      status = e
    }

    return status
  }
)

// Exports
module.exports = {
  list: watchersObj,
  watchersStatus: runAllWatchers()
}
