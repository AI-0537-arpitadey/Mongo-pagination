const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const CENTRAL_CONN = require("../db/central")
const Airport = require("./References/airport")
const Source = require("./source")
const CabinClass = require("./References/cabinclass")
const Pos = require("./References/pos")
const Currency = require("./References/currency")
const User = require("./user")
const { announce } = require("../lib")

const ShopSchema = new mongoose.Schema({
  _OD: [
    {
      _flyFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Airport,
      },
      _flyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Airport
      },
    }
  ],
  OD: [String], /* Redundant field */

  _sources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Source
    },
  ],
  _alternateSources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Source
    },
  ],
  _carriers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Source
    }
  ],

  isRoundTrip: {
    type: Boolean,
    default: false
  },
  los: Number,

  _cabinClasses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: CabinClass
    },
  ],

  pax: {
    adults: {
      type: Number,
      required: true
    },
    infants: Number,
    children: Number
  },
  _pos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Pos
  },
  posName: String, // Redundant
  _currency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Currency
  },
  currencyName: String, // Redundant
  horizons: { // Days
    type: [String],
    required: true
  },
  noOfStops: {
    type: String,
    enum: ["0", "1", "2", "3", "3+"],
    default: "0"
  },
  fareType: {
    type: String,
    enum: ["Regular", "Defence", "Doctors", "Senior Citizen", "Students"]
  },
  duration: {
    hour: Number,
    minute: Number
  },
  startDate: Date,

  shopName: { // editable
    type: String,
    required: true
  },
  _user: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true }, // User id
  userName: String, // Customer Name
  /* ???
  currQueue: Number,
  prevQueue: Number,

  lastRun: String,
  nextRun: String,
  */
  deliveryMode: [{ // editable
    type: String,
    enum: ["webhook", "db"]
  }],

  isDeleted: { // Soft Delete
    type: Boolean,
    default: false
  },

  isActiveStatus: {
    type: Boolean,
    default: true
  },

  _createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    default: null
  },
  _updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    default: null
  },
  vertical: String,
  isCustomerCreated: {
    type: Boolean
  },
  isRealtime: {
    type: Boolean,
    default: false
  },
  /* Delete log for audit */
  deletedBy: {
    what: {
      type: String,
      enum: ["Customer", "Admin"], // needs to be hardcoded, based on which API
    },
    _who: {
      type: mongoose.Schema.Types.ObjectId
    },
    when: {
      type: mongoose.Schema.Types.Date,
    }
  }
})

/* Virtual Population properties (populate only in GET route) */
ShopSchema.virtual("_schedules", {
  ref: "Schedule",
  localField: "_id",
  foreignField: "_shop",
  match: { isDeleted: false },
})

ShopSchema.virtual("_hooks", {
  ref: "Hook",
  localField: "_id",
  foreignField: "_user",
  match: { isDeleted: false },
})

ShopSchema.pre("validate", function (next) {
  this.wasNew = this.isNew
  this.vertical = process.env.VERTICAL
  return next()
})

ShopSchema.pre("validate", function (next) {
  this.isCustomerCreated = true // Hardcode field value
  this.cascadeInActive = this.isModified("isActiveStatus") && this.isActiveStatus === false // For using post hook

  return next()
})

ShopSchema.pre("save", function (next) {
  if (!this.isRoundTrip) {
    this.los = 0
  }
  next()
})

// eslint-disable-next-line prefer-arrow-callback
ShopSchema.post("save", async function (doc, next) {
  if (this.wasNew) {
    await announce("shop::create", doc)
  } else {
    await announce("shop::update", doc)
  }
  if (doc.cascadeInActive) {
    try {
      await Promise.all([
        CENTRAL_CONN.model("Schedule").updateMany({ _shop: doc._id, isActiveStatus: true }, { $set: { isActiveStatus: false } }),
        CENTRAL_CONN.model("Hook").updateMany({ _shop: doc._id, isActiveStatus: true }, { $set: { isActiveStatus: false } })
      ])
    } catch (err) {
      return next(err)
    }
  }
  return next()
})

ShopSchema.set("toJSON", { virtuals: true })
ShopSchema.set("toObject", { virtuals: true })
ShopSchema.set("timestamps", true)
ShopSchema.plugin(mongoosePaginate)

module.exports = CENTRAL_CONN.model("Shop", ShopSchema)
