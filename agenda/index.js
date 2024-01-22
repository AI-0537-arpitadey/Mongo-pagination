// agendaConfig.js

const Agenda = require("agenda")
const agenda = new Agenda({
  db: { address: process.env.MONGODB_CONNECTION_STRING, collection: "flightqueue" },
  processEvery: "30 seconds"
})

module.exports = {
  agenda
}
