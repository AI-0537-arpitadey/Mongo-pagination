const FlightRate = require("../routes/rest/flightrates")

module.exports = {
  async jobOne(job) {
    /*  */
    const totalPages = 10
    let prevPageEndId = null
    const paginations = {}

    // eslint-disable-next-line no-plusplus
    for (let pageNo = 2; pageNo <= totalPages; pageNo++) {
      console.log("pageNo ==> ", pageNo)

      // eslint-disable-next-line no-await-in-loop, max-len
      const endDoc = await FlightRate
        .find({ _id: { $gt: (prevPageEndId || null) } })
        .select("_id")
        .sort({ _id: 1 })
        .skip(9)
        .limit(1)
        .lean()
        .exec()

      if (endDoc.length > 0) {
        prevPageEndId = endDoc[0]._id
        paginations[pageNo] = String(prevPageEndId)
      } else {
        console.error(`No documents found for page ${pageNo}`)
      }
    }

    console.log("Paginations:", paginations)
  }
}
