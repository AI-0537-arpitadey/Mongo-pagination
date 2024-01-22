const mongoose = require("mongoose")
const CENTRAL_CONN = require("../db/central")
const { announce } = require("../lib")

const SourceSchema = new mongoose.Schema({

  source: {
    type: String,
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  isActiveStatus: {
    type: Boolean,
    default: true,
  },
  channel: {
    type: String,
    enum: ["Direct", "OTA", "Meta"]
  },
  isDeleted: { // Soft Delete
    type: Boolean,
    default: false
  },
  vertical: {
    type: String
  },
  isRealtime: {
    type: Boolean
  },
  maxCalls: {
    type: Number
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

SourceSchema.pre("validate", function (next) {
  this.wasNew = this.isNew
  this.vertical = process.env.VERTICAL
  return next()
})

SourceSchema.post("save", async function (doc) {
  if (this.wasNew) {
    await announce("source::create", doc)
  } else {
    await announce("source::update", doc)
  }
})

SourceSchema.set("toJSON", { virtuals: true })
SourceSchema.set("toObject", { virtuals: true })
SourceSchema.set("timestamps", true)

module.exports = CENTRAL_CONN.model("Source", SourceSchema)
