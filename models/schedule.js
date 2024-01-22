const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")
const { isValidCron } = require("cron-validator")
const cronstrue = require("cronstrue")

const CENTRAL_CONN = require("../db/central")
const Flightshop = require("./shop")
const User = require("./user")
const Timezone = require("./References/timezone")
const { announce } = require("../lib")

const ScheduleSchema = new mongoose.Schema({
  scheduleName: {
    type: String,
    require: true
  },
  _shop: {
    type: mongoose.Schema.Types.ObjectId, ref: Flightshop
  },
  _timezone: {
    type: mongoose.Schema.Types.ObjectId, ref: Timezone
  },
  timezoneName: {
    type: String // Reundant Field
  },

  // year: String,
  // month: String,

  minute: { type: String, default: "*" },
  hour: { type: String, default: "*" },
  dayOfMonth: { type: String, default: "*" },
  month: { type: String, default: "*" },
  dayOfWeek: { type: String, default: "*" },

  isActiveStatus: {
    type: Boolean,
    default: true
  },

  crontabExpression: String, // compute, validate, & set in hooks below

  startDate: String,
  endDate: String,

  _user: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true }, // customer Id
  userName: String, // Customer name
  vertical: {
    type: String
  },
  isDeleted: { // Soft Delete
    type: Boolean,
    default: false
  },
  isCustomerCreated: {
    type: Boolean
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

ScheduleSchema.pre("validate", function (next) {
  this.wasNew = this.isNew
  this.vertical = process.env.VERTICAL
  return next()
})
ScheduleSchema.pre("validate", function (next) {
  this.isCustomerCreated = true // Hardcode field value
  return next()
})
ScheduleSchema.pre("validate", function (next) {
  if (this.isDeleted === true) return next() // do not validate for soft deletes
  const crontabExpression = `${this.minute || "*"} ${this.hour || "*"} ${this.dayOfMonth || "*"} ${this.month || "*"} ${this.dayOfWeek || "*"}`
  if (!isValidCron(crontabExpression)) {
    return next(new Error("Invalid Crontab Expression!!"))
  }
  this.crontabExpression = crontabExpression
  return next()
})

ScheduleSchema.post("save", async function (doc) {
  if (this.wasNew) {
    await announce("schedule::create", doc)
  } else {
    await announce("schedule::update", doc)
  }
})

ScheduleSchema.virtual("crontabHuman").get(function () {
  return cronstrue.toString(this.crontabExpression, { verbose: true })
})

ScheduleSchema.set("toJSON", { virtuals: true })
ScheduleSchema.set("toObject", { virtuals: true })
ScheduleSchema.set("timestamps", true)
ScheduleSchema.plugin(mongoosePaginate)

module.exports = CENTRAL_CONN.model("Schedule", ScheduleSchema)
