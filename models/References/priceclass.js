const mongoose = require("mongoose")
const mongoosepaginate = require("mongoose-paginate-v2")
const CENTRAL_CONN = require("../../db/central")

const Source = require("../source")

const PriceClassSchema = new mongoose.Schema({

  channel: {
    type: String,
    required: true
  },
  sourceName: {
    type: String,
  },
  _source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Source,
    required: true
  },
  priceClass: {
    type: String,
    required: true
  },
  isActiveStatus: {
    type: Boolean,
    default: true
  },
  sourceCode: {
    type: Number,
    required: true
  },
  isDeleted: {
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

PriceClassSchema.set("toJSON", { virtuals: true })
PriceClassSchema.set("toObject", { virtuals: true })
PriceClassSchema.set("timestamps", true)
PriceClassSchema.plugin(mongoosepaginate)

module.exports = CENTRAL_CONN.model("PriceClass", PriceClassSchema)
