import postgres from "postgres"
// import {Pool} from 'pg'
// const {Pool} = require('pg')
// const log = require('../utils/log')
// const getEnv = require('../utils/getEnv')
import getEnv from '../utils/getEnv'

const pgOptions={
  "host": getEnv("PG_HOST","localhost"),
  "port": parseInt(getEnv("PG_PORT","5432")),
  "database":getEnv("PG_DB","todo_db"),
  "user":getEnv("PG_USER","postgres"),
  "password":getEnv("PG_PASS","changeme"),
  "max":parseInt(getEnv("PG_POOL_MAX_SIZE","20"))
}

// create new pool
const pool = postgres(pgOptions)

export default pool
// module.exports = pool