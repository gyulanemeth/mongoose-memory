# mongoose-memory

To make sure that your API (that uses `mongoose`) works correctly, you definitely should create tests with a real database. But writing everything to disk takes a lot of time. If you keep everything in memory and don't write anything to disk, then your tests can **speed up by 10x**. 

You probably want to do the following things while testing your API that connects to MongoDB via `mongoose`:
 - start a MongoDB instance
 - connect to that MongoDB instance with `mongoosse` (to a specific db)
 - create test data before each and every test case
 - purge the test data after the test cases
 - drop the test db and disconnect
 - stop the MongoDB instance

This lib is a wrapper for [mongodb-memory-server](https://www.npmjs.com/package/mongodb-memory-server) and implements exactly the mentioned functionalities above, except for the test data creation. (You will have to do it yourself.)

Everything is stored in memory only, so your tests will be super fast!

On top of the fact, that everything is stored in memory, you can run your tests in parallel, by starting separate mongodb-memory-server instances for all of your test suites. (For example, you don't need the `--runInBand` flag when testing with `Jest`.) This truly makes your tests super fast!


## Installation

```
npm i --save-dev
```

## Initialization

Have to pass a mongoose instance to the creator function.

```js
import mongoose from 'mongoose'
import createMongooseMemoryServer from 'mongoose-memory'

const mongooseMemoryServer = createMongooseMemoryServer(mongoose)
```

## Instance Functions

After initializing with a mongoose instance, the creator function returns an object with the following functions:

**async start()**

Starts a new mongodb-memory-server instance.

```javascript
await mongooseMemoryServer.start()
```

You can start multiple instances at the same time. (They will start separate mongodb-memory-server instances bound to different ports.)

**async connect(dbName)**

Connects to your test database (dbName - string).

```javascript
await mongooseMemoryServer.connect(dbName)
```

**async purge()**

Deletes all of the collections in your database.

```javascript
await mongooseMemoryServer.purge()
```

**async disconnect()**

Drops the database, mongoose disconnects.

```javascript
await mongooseMemoryServer.disconnect()
```

**async stop()**

Stops the mongodb-memory-server instance.

```javascript
await mongooseMemoryServer.stop()
```

You should invoke the stop function for every instance you started after your tests are finished running.



## Full-fledged Example with Jest

This [Jest](https://jestjs.io/) example shows you how to create a `mongodb-memory-server` instance and connect to a test db, how to purge the test data after every test, and finally how to disconnect and stop the db.

```javascript
import mongoose from 'mongoose'
import createMongooseMemoryServer from 'mongoose-memory'

// import other things that are needed for your tests

const mongooseMemoryServer = createMongooseMemoryServer(mongoose)

describe('Test suite', () => {
  beforeAll(async () => {
    await mongooseMemoryServer.start()
    await mongooseMemoryServer.connect('test-db')
  })
  beforeEach(async () => {
    // initialize your default db
  })
  afterEach(async () => {
    await mongooseMemoryServer.purge()
  })
  afterAll(async () => {
    await mongooseMemoryServer.disconnect()
    await mongooseMemoryServer.stop()
  })

  test('Example test', async () => {
    // Write your tests here
  })
})
```
As you can see above, you can do it for all of your test suites. It means, that each test suite will start it's own `mongodb-memory-server` instance. All the test suites will connect to separate instances, so you will be able to run your tests in parallel. (You don't need to use the `--runInBand` flag with Jest.)
