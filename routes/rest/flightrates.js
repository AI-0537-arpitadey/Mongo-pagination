const mongoose = require("mongoose")
const FlightRate = require("../../models/Flightrates")

module.exports = {
  async get(req, res) {
    try {
      return res.status(200)
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message })
    }
  }

}
