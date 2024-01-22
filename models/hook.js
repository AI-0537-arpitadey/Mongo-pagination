const mongoose = require("mongoose")
const mongoosepaginate = require("mongoose-paginate-v2")
const CENTRAL_CONN = require("../db/central")

const Shop = require("./shop")
const User = require("./user")
const { announce } = require("../lib")

const HookSchema = new mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId, // Customer ID
    ref: User,
    required: true
  },
  userName: { // Redundant field for _user
    type: String
  },
  endPoint: {
    type: String,
    required: true
  },
  authType: {
    type: String,
    default: null
  },
  userId: {
    type: String,
    default: null
  },
  pwdTxt: {
    type: String,
    default: null
  },
  token: {
    type: String,
    default: null
  },
  hookType: {
    type: String,
    required: true
  },
  isActiveStatus: {
    type: Boolean,
    default: false
  },
  _shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Shop,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  vertical: {
    type: String
  },
  isCustomerCreated: {
    type: Boolean
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

HookSchema.pre("validate", function (next) {
  this.wasNew = this.isNew
  this.vertical = process.env.VERTICAL
  return next()
})
HookSchema.pre("validate", function (next) {
  this.isCustomerCreated = true // Hardcode field value
  return next()
})

HookSchema.post("save", async function (doc) {
  if (this.wasNew) {
    await announce("hook::create", doc)
  } else {
    await announce("hook::update", doc)
  }
})

HookSchema.set("toJSON", { virtuals: true })
HookSchema.set("toObject", { virtuals: true })
HookSchema.set("timestamps", true)
HookSchema.plugin(mongoosepaginate)

module.exports = CENTRAL_CONN.model("Hook", HookSchema)
