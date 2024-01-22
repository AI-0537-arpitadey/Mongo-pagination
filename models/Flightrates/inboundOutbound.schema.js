const mongoose = require("mongoose")

const Airline = require("../References/airlines")
const PriceClass = require("../References/priceclass")

const inboundOutboundSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  baseFare: Number,
  feesAndOthers: mongoose.Schema.Types.Mixed,
  description: String,

  numOfStops: {
    type: Number,
    required: true
  },
  bookingClass: String,
  baggageDetails: mongoose.Schema.Types.Mixed,
  promoCode: mongoose.Schema.Types.Mixed,
  discounts: mongoose.Schema.Types.Mixed,
  metaProviderName: mongoose.Schema.Types.Mixed,

  legs: [{
    origin: {
      type: String,
      required: true
    },
    destination: {
      type: String,
      required: true
    },

    fbc: String,
    seatCount: Number,

    departureDate: Date,
    departureTime: String,
    arrivalDate: Date,
    arrivalTime: String,

    airlineShortCode: String,

    flightNumber: {
      type: String,
      required: true
    },
    flightTime: String,
    waitTime: String,
    distance: Number,
    operatedBy: String,
    _airline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Airline
    },
    airlineName: String, // Redundant fields
    airlineCode: String, // Redundant fields
  }],

  layover: String,
  flightStatusCode: Number,
  taxStatus: Number,

  departureDate: Date,
  departureTime: String,
  arrivalDate: Date,
  arrivalTime: String,

  totalDuration: String,
  flightTime: String,

  actualPrice: {
    type: Number,
    required: true
  },
  actualBaseFare: Number,
  actualFeeAndOthers: mongoose.Schema.Types.Mixed,
  // _currency: { type: Schema.Types.ObjectId, ref: "Currency" },
  // currencyName: String, // Redundant Fields
  _priceClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: PriceClass
  },
  priceClassName: String // Redundant fields
})

inboundOutboundSchema.virtual("allFlightNumbers").get(function () {
  return this.legs.map(({ flightNumber }) => flightNumber)
  // return [...new Set([...this.legs.map(({ flightNumber }) => flightNumber)])]
})

inboundOutboundSchema.virtual("allStopOverAirports").get(function () {
  return [
    this.legs[0].origin,
    ...this.legs.map(({ destination }) => destination)
  ]
})

inboundOutboundSchema.virtual("allAirlineCodes").get(function () {
  return this.legs.map(({ airlineCode }) => airlineCode)
})

inboundOutboundSchema.set("toJSON", { virtuals: true })
inboundOutboundSchema.set("toObject", { virtuals: true })

module.exports = inboundOutboundSchema
