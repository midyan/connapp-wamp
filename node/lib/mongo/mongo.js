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
  events: () => {
    //Model info
    const collectionName = 'events'
    const modelName = 'events'
    const model =  {
      name: {
        type: String,
        required: true
      },
      start: {
        type: Date,
        required: true
      },
      end: {
        type: Date,
        required: true
      },
      local: {
        type: ObjectId
      },
      order: {
        type: Number,
        required: false
      },
      eventType: {
        type: ObjectId
      },
      speakers: [{
        type: ObjectId
      }],
      likes: {
        type: Number,
        default: 0,
        required: false
      },
      active: {
        type: Boolean,
        default: true
      },
      lastUpdate: {
        type: Date,
        default: Date.now,
      },
      createAt: {
        type: Date,
        default: Date.now,
      },
    }

    //Define Schema
    const dataSchema = mongoose.Schema(model, {collection: collectionName})

    //Defines Pre-Save hook
    dataSchema.pre('save', function(next){
      // Defines arguments for dispatch function
      this.lastUpdate = new Date()

      const _id = this._id.toString(),
            data = _.cloneDeep(this)

      // Dispatches for realtimeUpdate
      if (this.isNew) {
        dispatcher.insertToApp(modelName, data)
      } else {
        dispatcher.updateDocumentToApp(modelName, _id, data)
      }

      next()
    })

    //return Schema and Model Name
    return {
      schema: dataSchema,
      name: modelName
    }
  },
  locals: () => {
    //Model info
    const collectionName = 'locals'
    const modelName = 'locals'
    const model =  {
      name: {
        type: String,
        required: true
      },
      mapImage: {
        type: String,
        required: false
      },
      active: {
        type: Boolean,
        default: true
      },
      createAt: {
        type: Date,
        default: Date.now
      },
      lastUpdate: {
        type: Date,
        default: Date.now
      }
    }

    //Define Schema
    const dataSchema = mongoose.Schema(model, {collection: collectionName})

    //Define hooks
    dataSchema.pre('save', function(next){
      // Defines arguments for dispatch function
      this.lastUpdate = new Date()

      const _id = this._id.toString(),
            data = _.cloneDeep(this)

      // Dispatches for realtimeUpdate
      if (this.isNew) {
        dispatcher.insertToApp(modelName, data)
      } else {
        dispatcher.updateDocumentToApp(modelName, _id, data)
      }

      next()
    })

    //return Schema and Model Name
    return {
      schema: dataSchema,
      name: modelName
    }
  },
  eventtypes: () => {
    //Model info
    const collectionName = 'eventtypes'
    const modelName = 'eventtypes'
    const model =  {
      name: {
        type: String,
        required: true
      },
      active: {
        type: Boolean,
        default: true
      },
      createAt: {
        type: Date,
        default: Date.now
      },
      lastUpdate: {
        type: Date,
        default: Date.now
      }
    }

    //Define Schema
    const dataSchema = mongoose.Schema(model, {collection: collectionName})

    //Define hooks
    dataSchema.pre('save', function(next){
      // Defines arguments for dispatch function
      this.lastUpdate = new Date()

      const _id = this._id.toString(),
            data = _.cloneDeep(this)

      // Dispatches for realtimeUpdate
      if (this.isNew) {
        dispatcher.insertToApp(modelName, data)
      } else {
        dispatcher.updateDocumentToApp(modelName, _id, data)
      }

      next()
    })

    //return Schema and Model Name
    return {
      schema: dataSchema,
      name: modelName
    }
  },
  news: () => {
    //Model info
    const collectionName = 'news'
    const modelName = 'news'
    const model =  {
     /**
      * Titulo da notícia.
      * @type {String}
      */
      title: {
        type: String,
        required: true
      },
      /**
      * Mensagem da notícia
      * @type {String}
      */
      message: {
        type: String,
        required: true
      },
      /**
      * Capa da notícia.
      * @type {String}
      */
      cover: {
        type: String
      },
      /**
      * Define se o notícia está ativo.
      * @type {Boolean}
      */
      active: {
        type: Boolean,
        default: true
      },
      /**
      * Data de criação do notícia.
      * @type {Date}
      */
      createAt: {
        type: Date,
        default: Date.now
      },
      /**
      * Data da última vez que os dados do notícia foi atualizado.
      * @type {String}
      */
      lastUpdate: {
        type: Date,
        default: Date.now
      }
    }
    //Define Schema
    const dataSchema = mongoose.Schema(model, {collection: collectionName})

    //Define hooks
    dataSchema.pre('save', function(next){
      // Defines arguments for dispatch function
      this.lastUpdate = new Date()

      const _id = this._id.toString(),
            data = _.cloneDeep(this)

      // Dispatches for realtimeUpdate
      if (this.isNew) {
        dispatcher.insertToApp(modelName, data)
      } else {
        dispatcher.updateDocumentToApp(modelName, _id, data)
      }

      next()
    })

    //return Schema and Model Name
    return {
      schema: dataSchema,
      name: modelName
    }
  },
  speakers: () => {
    //Model info
    const collectionName = 'speakers'
    const modelName = 'speakers'
    const model =  {
      name: {
        type: String,
        required: true
      },
      institution: {
        type: String,
        required: false
      },
      image: {
        perfil: {
          type: String
        },
        cover: {
          type: String
        },
        type: Object
      },
      profession: {
        type: String
      },
      about: {
        type: String
      },
      media: {
        type: String
      },
      active: {
        type: Boolean,
        default: true
      },
      createAt: {
        type: Date,
        default: Date.now
      },
      lastUpdate: {
        type: Date,
        default: Date.now
      }
    }

    //Define Schema
    const dataSchema = mongoose.Schema(model, {collection: collectionName})

    //Define hooks
    dataSchema.pre('save', function(next){
      // Defines arguments for dispatch function
      this.lastUpdate = new Date()

      const _id = this._id.toString(),
            data = _.cloneDeep(this)

      // Dispatches for realtimeUpdate
      if (this.isNew) {
        dispatcher.insertToApp(modelName, data)
      } else {
        dispatcher.updateDocumentToApp(modelName, _id, data)
      }

      next()
    })

    //return Schema and Model Name
    return {
      schema: dataSchema,
      name: modelName
    }
  }


}

// Export functon, to compile all models
module.exports = () => {

  // Map raw schemas to compiled modules
  const compiled = _.mapValues(models, (value, key) => {
    // Get schema object
    const model = value()

    // Returns compiled module
    return mongoose.model(model.name, model.schema)
  })

  // Return Object with compiled odels and mongoose connection object
  return {
    models: compiled,
    mongoose: mongoose
  }
}
