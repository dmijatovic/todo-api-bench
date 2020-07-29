import {Oak} from "./deps.ts"

import getEnv from "./utils/getEnv.ts"
import router from './routes/router.ts'
import {dbPool} from "./pgdb/pgdb.ts"
import logger, {LogInfo} from './utils/logger.ts'

const api = new Oak()
// initialize logger (get appName)
// initLogger()
// db connection
const client = await dbPool.connect()

// console.log("client:", client)

// TLS implementation
// const certFile:string = Deno.env.get("CERT_FILE") || "./cert/server.crt"
// const keyFile:string = Deno.env.get("KEY_FILE") || "./cert/server.pem"

const options={
  port:parseInt(getEnv("API_PORT","8080")),
  // secure: false,
  // certFile: certFile,
  // keyFile: keyFile
}

// use logger
api.use(logger)
// routes
api.use(router.routes())

// log start of listening
api.addEventListener("listen",()=>{
  LogInfo(`server on ${options.port}`)
})

// listen for close
//listen
api.listen(options).then(()=>{
  LogInfo(`CLOSING server....`)
  // console.log("Closing PostgreSQL...")
  client.release()
})

