import {Application} from "../deps.ts"

import router from './routes/router.ts'
import logger from './utils/logger.ts'

import {dbPool, runQuery} from "./pgdb/pgdb.ts"

const api = new Application()

// db connection
const client = await dbPool.connect()

// console.log("client:", client)

// TLS implementation
// const certFile:string = Deno.env.get("CERT_FILE") || "./cert/server.crt"
// const keyFile:string = Deno.env.get("KEY_FILE") || "./cert/server.pem"

const options={
  port:8080,
  // secure: false,
  // certFile: certFile,
  // keyFile: keyFile
}

console.log("Starting server...", options.port)
// use logger
api.use(logger)
// routes
api.use(router.routes())
// listen
await api.listen(options)

console.log("Closing PostgreSQL...")
client.release()
