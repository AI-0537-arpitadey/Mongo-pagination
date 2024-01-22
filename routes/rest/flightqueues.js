const Agenda = require("agenda")
const mongoose = require("mongoose")
const FlightQueue = require("../../models/flightqueue")
const FlightRate = require("../../models/Flightrates")

module.exports = {

  async post(req, res) {
    const { flightqueueid } = req.body
    try {
      // const docs = await FlightQueue.find({}).exec()
      // return res.status(200).send(docs)
      const flightQueueDoc = await FlightQueue.findOne({ _id: flightqueueid }).exec()
      if (flightQueueDoc === null) return res.status(400).json({ error: true, message: `No such flightqueueid ${flightqueueid}` })

      const totalDocuments = flightQueueDoc.toObject().rowCount
      console.log("totalDocuments ==> ", flightQueueDoc)

      const itemsPerPage = 10
      const totalPages = Math.ceil(totalDocuments / itemsPerPage)
      console.log("totalPages ==> ", totalPages)

      const firstDoc = await FlightRate
        .find({})
        .select("_id")
        .sort({ _id: 1 })
        .skip(9)
        .limit(1)
        .lean()
        .exec()

      let prevPageEndId = firstDoc[0]._id
      const paginations = { 1: prevPageEndId }

      console.log("pageFirstId ==> ", prevPageEndId)

      // eslint-disable-next-line no-plusplus
      for (let pageNo = 2; pageNo <= totalPages; pageNo++) {
        console.log("pageNo ==> ", pageNo)
        // eslint-disable-next-line no-await-in-loop, max-len
        const endDoc = await FlightRate
          .find({ _id: { $gt: (prevPageEndId) } })
          .select("_id")
          .sort({ _id: 1 })
          .skip(9)
          .limit(1)
          .lean()
          .exec()

        prevPageEndId = endDoc[0]._id
        paginations[pageNo] = String(prevPageEndId)
      }
      flightQueueDoc.paginations = paginations
      await flightQueueDoc.save()
      return res.status(200).json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message })
    }
  }
}
