
import {Pool} from "pg"
// const {Pool} = require('pg')
// const log = require('../utils/log')
// const getEnv = require('../utils/getEnv')
import getEnv from '../utils/getEnv'
import { logError, logInfo } from "../utils/log"

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

export async function dbConnect(timeout = 2000) {
  try {
    // try to connect after timeout
    setTimeout(async () => {
      const client = await pool.connect()
      await client.query('SELECT NOW()')
      // release this request
      client.release()
      logInfo("Connected to database...")
    }, timeout)
  } catch (e: any) {
    logError(e.message)
    process.exit(1)
  }
}

export default pool
