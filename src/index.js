import { MongoMemoryServer } from 'mongodb-memory-server'

export default function start (mongoose) {
  let mongod

  async function start () {
    try {
      mongod = await MongoMemoryServer.create()
    } catch (e) {
      console.error('MongoDB Memory Server Error - start', e)
    }
  }

  async function connect (dbName) {
    try {
      const mongoUri = await mongod.getUri()
      await mongoose.connect(mongoUri, { dbName })
      console.log('Memory MongoDB URI', mongoUri)
    } catch (e) {
      console.log('MongoDB Memory Server Error - connect', e)
    }
  }

  async function purge () {
    try {
      const collections = await mongoose.connection.db.listCollections()
      const collectionsArray = await collections.toArray()

      await Promise.all(collectionsArray.map(collection => mongoose.connection.dropCollection(collection.name)))
    } catch (e) {
      console.log('MongoDB Memory Server Error - purge', e)
    }
  }

  async function disconnect () {
    try {
      await mongoose.connection.dropDatabase()
      await mongoose.connection.close()
    } catch (e) {
      console.log('MongoDB Memory Server Error - disconnect', e)
    }
  }

  async function stop () {
    try {
      await mongod.stop()
    } catch (e) {
      console.log('MongoDB Memory Server Error - stop', e)
    }
  }

  return {
    start,
    connect,
    purge,
    disconnect,
    stop
  }
}
