// Import Modules
const INDEX = require('../../index.js')

// Import Packages
const _ = require('lodash')
const mongoose = require('mongoose')

// Define helper variables
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const Mixed = Schema.Types.Mixed
const dispatcher = INDEX.dispatcher
const MONGO = INDEX.CONFIG.MONGO

// Connect to Mongo
mongoose.connect(MONGO.URL)

//Models
const models = {
  fakenews: () => {
    // Defines collection namem
    const collectionName = 'fakenews'

    // Defines model name
    const modelName = 'fakenews'

    // Defines model for the schema
    const model =  {
      title: {
        type: String
      },
      body: {
        type: String
      }
    }

    //Defines Schema using model and collection name
    const dataSchema = mongoose.Schema(model, {collection: collectionName})

    //Defines Pre-Save hook
    dataSchema.post('save', function(){
      // Defines arguments for dispatch function
      const _id = this._id.toString(),
            data = _.cloneDeep(this)

      // Dispatches for realtimeUpdate
      if (this.isNew) {
        dispatcher.insertToApp(modelName, data)
      } else {
        dispatcher.updateDocumentToApp(modelName, _id, data)
      }
    })

    //return Schema and Model Name
    return {
      schema: dataSchema,
      name: modelName
    }
  }

  // #----Example----#
  // User: () => {
  //   //Model info
  //   var collectionName = ''
  //   var modelName = ''
  //   var model = {
  //     email: {
  //       type: String,
  //       required: true
  //     },
  //     name: {
  //       type: String,
  //       required: false,
  //     },
  //     password: {
  //       type: String,
  //       required: true
  //     },
  //     date_registered: {
  //       type: Date,
  //       default: Date.now
  //     }
  //   }
  //
  //   //Define Schema
  //   var dataSchema = mongoose.Schema(model, {collection: collectionName})
  //
  //   //Define hooks
  //   dataSchema.pre('save', function(next){
  //     next()
  //   })
  //
  //   //return Schema and Model Name
  //   return {
  //     schema: dataSchema,
  //     name: modelName
  //   }
  // }
}

// Export functon, to compile all models
module.exports = () => {

  // Map raw schemas to compiled modules
  const compiled = _.mapValues(models, (value, key) => {
    // Get schema object
    const model = value()

    // Returns compiled module
    return mongoose.model(model.modelName, model.schema)
  })

  // Return Object with compiled odels and mongoose connection object
  return {
    models: compiled,
    mongoose: mongoose
  }
}
