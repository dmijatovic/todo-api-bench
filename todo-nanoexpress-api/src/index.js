const {api, PORT} = require('./api')
const {logInfo, logError} = require('./utils/log')
const db = require('./db/pgdb')

// this is just connection test
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

api.listen(PORT)
  .then(()=>{
    // connect to DB
    ConnectDB()
    logInfo(`Started api server on ${PORT}`)
  })
  .catch(e=>{
    logError(`Failed to start server on ${PORT}`)
  })
