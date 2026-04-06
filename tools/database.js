import mongoose from 'mongoose'

let connected = false

async function ensureConnection() {
  if (!connected) {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp'
    await mongoose.connect(uri)
    connected = true
  }
}

export async function dbQuery(operation, collection, filter = {}, data = {}) {
  try {
    await ensureConnection()

    const db = mongoose.connection.db
    const col = db.collection(collection)

    switch (operation) {
      case 'find': {
        const results = await col.find(filter).toArray()
        return { success: true, result: results }
      }
      case 'findOne': {
        const doc = await col.findOne(filter)
        return { success: true, result: doc }
      }
      case 'insert': {
        const insertResult = await col.insertOne(data)
        return { success: true, result: { insertedId: insertResult.insertedId } }
      }
      case 'update': {
        const updateResult = await col.updateOne(filter, { $set: data })
        return {
          success: true,
          result: {
            matchedCount: updateResult.matchedCount,
            modifiedCount: updateResult.modifiedCount
          }
        }
      }
      case 'delete': {
        const deleteResult = await col.deleteOne(filter)
        return { success: true, result: { deletedCount: deleteResult.deletedCount } }
      }
      default:
        return { success: false, result: null, error: `Unknown operation: ${operation}` }
    }
  } catch (error) {
    return { success: false, result: null, error: error.message }
  }
}

export const schemas = [
  {
    name: 'db_query',
    description: 'Runs a MongoDB operation (find, findOne, insert, update, delete) on a collection',
    input_schema: {
      type: 'object',
      properties: {
        operation: {
          type: 'string',
          enum: ['find', 'findOne', 'insert', 'update', 'delete'],
          description: 'Database operation to perform'
        },
        collection: { type: 'string', description: 'MongoDB collection name' },
        filter: { type: 'object', description: 'Query filter' },
        data: { type: 'object', description: 'Data for insert/update operations' }
      },
      required: ['operation', 'collection']
    }
  }
]
