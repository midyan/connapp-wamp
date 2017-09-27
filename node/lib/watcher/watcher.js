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
  Object.keys(mongo.models).forEach(model => {
    const Model = mongo.models[model]
    ws.subscribe(`connapp.server.${model.toLowerCase()}.update`, data => {
      Model
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
  })
}

/**
 * Function to watch for inserts on all collections
 */
const watchInserts = () => {
  Object.keys(mongo.models).forEach(model => {
    const Model = mongo.models[model]
    ws.subscribe(`connapp.server.${model.toLowerCase()}.insert`, function(data) {
      let doc = new Model(data)

      // Make sure this is treated as new by the post-save hook
      doc.isNew = true

      doc.save()
        .then(res => {
          // console.log(res)
        })
        .catch(err => console.log(err))
    })
  })
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
      const mobileQuery = sentData.argsDict.query
      const mobileSession = sentData.argsDict.session
      const fecthAll = sentData.argsDict.fetchAll === true

      console.log(sentData.argsDict)
      // console.log(uri+' was triggered')

      Model
        .find(mobileQuery).exec()
        .then(data => {
          // console.log(data)
          // If nothing is found, does nothing
          if (!data.length) return true

          // console.log(ids)
          // Loops through the found data and dispatch route accordingly

          if (!fecthAll) {
            data.forEach(item => {
              const _id = item._id.toString()
              if ( ids.indexOf(_id) == -1 ) {
                dispatcher.insertToApp(model, item, data.length, mobileSession)
              } else {
                // console.log(item)
                dispatcher.updateDocumentToApp(model, _id, item, mobileSession)
              }
            })
          } else {
            const insertData = data.filter(item => {
              return ids.indexOf(item._id) == -1
            })
            const updateData = data.filter(item => {
              return ids.indexOf(item._id) != -1
            })

            if (insertData.length) {
              _.chunk(insertData, 10).forEach(item => {
                dispatcher.insertToApp(model, item, data.length, mobileSession)
              })
            }

            if (updateData.length) {
              updateData.forEach(item => {
                dispatcher.updateDocumentToApp(model, _id, item, mobileSession)
              })
            }
          }

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
