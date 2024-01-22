const mongoose = require("mongoose")
const mongoosepaginate = require("mongoose-paginate-v2")

const Shop = require("./shop")
const User = require("./user")
const Currency = require("./References/currency")

const HistoricalRateSchema = new mongoose.Schema({
  rowHash: { // Computed
    type: String,
    required: true,
  },
  _flightShop: {
    type: mongoose.Schema.Types.ObjectId, // shop ID
    ref: Shop,
    required: true
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId, // Customer ID
    ref: User,
    required: true
  },
  price: {
    type: Number
  },
  collectedAt: {
    type: Date,
  },
  _currency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Currency,
    required: true
  },
  departTime: {
    type: String,
    default: null
  },
})

HistoricalRateSchema.set("toJSON", { virtuals: true })
HistoricalRateSchema.set("toObject", { virtuals: true })
HistoricalRateSchema.set("timestamps", true)
HistoricalRateSchema.plugin(mongoosepaginate)
HistoricalRateSchema.set("collection", "HistoricalRates")

module.exports = mongoose.model("HistoricalRate", HistoricalRateSchema)
