const mongoose = require("mongoose")
const Schedule = require("./schedule")
const Shop = require("./shop")
const User = require("./user")
require("dotenv").config()

const FlightQueueSchema = new mongoose.Schema({
  _schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Schedule,
    required: false
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId, // Customer ID
    ref: User,
    required: true
  },
  userName: {
    type: String
  },
  _flightShop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Shop,
    required: true
  },
  createdDate: {
    type: Date
  },
  status: {
    type: String,
    default: "IN_PROGRESS"
  },
  isRealtime: {
    type: Boolean,
    default: false
  },
  totalCalls: {
    type: Number,
    default: 0
  },
  expectedCallCount: {
    type: Number,
    default: 0
  },
  paginations: {}
})

FlightQueueSchema.set("timestamps", true)
FlightQueueSchema.set("toJSON", { virtuals: true })
FlightQueueSchema.set("toObject", { virtuals: true })
FlightQueueSchema.set("collection", process.env.FLIGHT_COLLECTION || "flightqueues")

module.exports = mongoose.model("FlightQueue", FlightQueueSchema)
