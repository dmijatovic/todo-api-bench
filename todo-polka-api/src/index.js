
const {api, PORT} = require('./api')
const {logInfo, logError} = require('./utils/log')
const db = require('./db/pgdb')

function ConnectDB(withDelay=1000){
  setTimeout(()=>{
    db.connect()
      .then(c =>{
        if (c) {
          logInfo(`Connected to PostgreSQL`)
        } else {
          logError(`Filed to connect to PostgreSQL. ERROR: client not returned from connection pool`)
        }
      })
      .catch(err=>{
        logError(`Filed to connect to PostgreSQL. ERROR: ${err.message}`)
        db.end()
        process.exit(-1)
      })
  },withDelay)
}

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

api.listen(PORT, ()=>{
  //delayed connection
  ConnectDB(3000)
  // console.log("Polka server on port",PORT)
  logInfo(`Server on port ${PORT}`)
})
