const mongoose = require("mongoose")
// eslint-disable-next-line max-len
const CENTRAL_CONN = mongoose.createConnection(process.env.MONGODB_OTHER_CONNECTION_STRING, { minPoolSize: 10, serverSelectionTimeoutMS: 90000, useUnifiedTopology: true })

module.exports = CENTRAL_CONN
