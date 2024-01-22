const mongoose = require("mongoose")
const Shop = require("./shop")
const User = require("./user")
require("dotenv").config()

const RealtimeLogsSchema = new mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId, // Customer ID
    ref: User,
    required: true
  },
  userName: {
    type: String
  },
  _flightshop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Shop,
    required: true
  },
  dtCollected: {
    type: Date
  },
  statusCode: {
    type: Number,
    default: 0
  }
})

RealtimeLogsSchema.set("timestamps", true)
RealtimeLogsSchema.set("toJSON", { virtuals: true })
RealtimeLogsSchema.set("toObject", { virtuals: true })
RealtimeLogsSchema.set("collection", process.env.REALTIMELOGS_COLLECTION)

module.exports = mongoose.model("RealtimeLogs", RealtimeLogsSchema)
