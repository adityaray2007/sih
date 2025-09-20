import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string
if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env.local')

interface GlobalWithMongoose {
  mongooseConn?: typeof mongoose
  mongoosePromise?: Promise<typeof mongoose>
}

const globalForMongoose = global as unknown as GlobalWithMongoose

export async function connectToDatabase() {
  if (globalForMongoose.mongooseConn) return globalForMongoose.mongooseConn

  const promise = mongoose.connect(MONGODB_URI, { dbName: 'sih-db' })
  globalForMongoose.mongoosePromise = promise
  globalForMongoose.mongooseConn = await promise
  return globalForMongoose.mongooseConn
}