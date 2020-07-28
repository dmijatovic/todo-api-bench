// import {Pool} from 'pg'

const {Pool} = require('pg')
const config = require('../api.config.js')
const log = require('../utils/log')

// create new pool
const pool = new Pool(config.pgOptions)

pool.connect()
  .then(c =>{
    if (c) {
      log.logInfo(`Connected to PostgreSQL`)
    } else {
      log.logError(`Filed to connect to PostgreSQL [${config.pgOptions.host}] ERROR: client not returned from connection pool`)
    }
  })
  .catch(err=>{
    log.logError(`Filed to connect to PostgreSQL [${config.pgOptions.host}] ERROR: ${err.message}`)
    pool.end()
    process.exit(-1)
  })

// export default pool
module.exports = pool