
const {api, PORT} = require('./api')
const {logInfo} = require('./utils/log')
const db = require('./db/pgdb')

api.listen(PORT, ()=>{
  // console.log("Polka server on port",PORT)
  logInfo(`Server on port ${PORT}`)
})

// listen to container/process stop
// and stop polka server
process.on("SIGINT",()=>{
  // console.info("Closing node server on SIGINT")
  db.end()
  logInfo("Closing server on SIGINT")
  process.exit(0)
})

process.on("SIGTERM",()=>{
  // console.info("Closing node server on SIGTERM")
  db.end()
  logInfo("Closing server on SIGTERM")
  process.exit(0)
})