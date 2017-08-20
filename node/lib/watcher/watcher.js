// Import Modules
const INDEX = require('../../index.js')

// Import Packages
const _ = require('lodash')
const merge = require('merge')

// Define helper variables
const ws = INDEX.connection
const mongo = INDEX.mongo

/**
 * Function to watch for updates on all collections
 */
const watchUpdates = () => {
  for (var model in mongo.models) {
    ws.subscribe(`connapp.${model.toLowerCase()}.update`, function(data) {
      mongo.models[model]
      .findOne({_id: item._id}).exec()
      .then(res => {
        // deletes save so it won't conflict on merging
        delete res.save

        // merges with new data
        merge(res, data)

        // saves Updated item
        return res.save()
      })
      .then(res => {
        console.log(res)
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
    ws.subscribe(`connapp.${model.toLowerCase()}.insert`, function(data) {
      const doc = new mongo.models[model](data)
      doc.save()
        .then(res => {
          console.log(res)
        })
        .catch(err => console.log(err))
    })
  }
}

/**
 * Function to watch for inserts on all collections
 */
const watchSync = () => {
  console.log('Starting watch for sync routes')
  for (var model in mongo.models) {
    console.log('sync for '+ model)
    const uri = `connapp.${model.toLowerCase()}.sync`
    console.log(`Subscribing for ${uri}`)
    ws.subscribe(uri, function() {
      console.log(`CALLED - ${uri}`)
      mongo.models[model]
        .find({}).exec()
        .then(data => {
          console.log('Mongo consulted')
          console.log(data)
          ws.publish(`connapp.${model.toLowerCase()}.fetch.sync`, data)
	       })
        .catch(err => console.log(err))
    })
  }
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
