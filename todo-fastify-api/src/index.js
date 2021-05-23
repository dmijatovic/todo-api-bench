const fastify = require('fastify')({
  logger:true
})
const getEnv = require("./utils/getEnv")
const {logInfo,logError} = require("./utils/log")
const db = require('./db/pgdb')
const api = require("./api")

const PORT = parseInt(getEnv("API_PORT","8080"))

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
        process.exit(1)
      })
  },withDelay)
}

// api routes
fastify.register(api)

// Run the server!
// For Docker we need to specify 0.0.0.0
fastify.listen(PORT,'0.0.0.0', function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // connect to DB
  ConnectDB()
  // fastify.log.info('Server listening on ${address}`)
})


