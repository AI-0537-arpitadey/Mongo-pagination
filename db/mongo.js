const { Mongoose } = require("mongoose")
const logger = require("../lib/logger")

const { MONGO_URI, MONGO_DBNAME } = process.env
let mongoose

async function connect() {
  logger.info("Connecting to Mongo DB ⌛")
  mongoose = await Mongoose.connect(
    MONGO_URI,
    { minPoolSize: 10, serverSelectionTimeoutMS: 90000, useUnifiedTopology: true }
  )
  if (mongoose === undefined) throw new Error("Failed to define mongo client!!")
  logger.info("Connected to Mongo DB 💯")
}

async function get(dbname = MONGO_DBNAME) {
  return mongoose.db(dbname)
}

async function close() {
  mongoose.close()
}

module.exports = {
  connect,
  get,
  close
}
