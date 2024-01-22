const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const inboundOutboundSchema = require("./inboundOutbound.schema")

const User = require("../user")
const Pos = require("../References/pos")
const CabinClass = require("../References/cabinclass")
const Currency = require("../References/currency")
const Source = require("../source")
const FlightShop = require("../shop")
const Airport = require("../References/airport")

const flightratesSchema = new mongoose.Schema(
  {
    batchInsertionId: mongoose.Schema.Types.Mixed,
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User
    },
    userName: String, // Redundant fields
    rowHash: { // Computed
      type: String,
      required: true,
    },
    _flyFrom: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: Airport
    },
    flyFrom: String,
    _flyTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: Airport
    },
    flyTo: String,
    isRoundTrip: {
      type: Boolean,
      default: false
    },
    departDate: {
      type: Date,
      required: true
    },
    returnDate: {
      type: Date,
      required() { return this.isRoundTrip === true }
    },
    travellers: {
      adults: { type: Number, required: true, default: 0 },
      infants: { type: Number, default: 0 },
      children: { type: Number, default: 0 }
    },
    channelName: String,
    channelType: String,
    airlineCode: Number,
    outbound: inboundOutboundSchema,
    inbound: inboundOutboundSchema,
    totalPrice: Number,
    isRatePerPerson: {
      type: Boolean,
      default: false
    },
    previousPrice: Number,
    isMultipleAirline: {
      type: Boolean,
      default: false
    },
    collectedAt: Date,
    statusCode: Number,
    _flightShop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: FlightShop
    },
    flightShopName: String, // Redundant fields
    _source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Source
    },
    sourceName: String,
    sourceId: Number,
    _pos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Pos
    },
    posName: String, // posName is meaning code
    _cabinClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CabinClass
    },
    _currency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Currency
    },
    currencyName: String, // Redundant fields
  }
)

flightratesSchema.set("toJSON", { virtuals: true })
flightratesSchema.set("toObject", { virtuals: true })
flightratesSchema.set("timestamps", true)
flightratesSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("FlightRate", flightratesSchema)
