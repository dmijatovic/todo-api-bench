
const {Pool} = require('pg')
const log = require('../utils/log')
const getEnv = require('../utils/getEnv')

const pgOptions={
  "host": getEnv("PG_HOST","localhost"),
  "port": parseInt(getEnv("PG_PORT","5432")),
  "database":getEnv("PG_DB","todo_db"),
  "user":getEnv("PG_USER","postgres"),
  "password":getEnv("PG_PASS","changeme"),
  "max":parseInt(getEnv("PG_POOL_MAX_SIZE","20"))
}

// create new pool
const pool = new Pool(pgOptions)

pool.connect()
  .then(c =>{
    if (c) {
      log.logInfo(`Connected to PostgreSQL`)
    } else {
      log.logError(`Filed to connect to PostgreSQL [${pgOptions.host}] ERROR: client not returned from connection pool`)
    }
  })
  .catch(err=>{
    log.logError(`Filed to connect to PostgreSQL [${pgOptions.host}] ERROR: ${err.message}`)
    pool.end()
    process.exit(-1)
  })

// export default pool
module.exports = pool