import {Oak} from "./deps.ts"
import getEnv from "./utils/getEnv.ts"
import router from './routes/router.ts'
import {initDBPool, getClient} from "./pgdb/pgdb.ts"
import {Pool, PoolClient} from "./deps.ts"
import logger, {LogInfo, LogError} from './utils/logger.ts'

let client:PoolClient
const api = new Oak()

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

function ConnectDB(withDelay=1000){
  setTimeout(()=>{
    const dbPool:Pool = initDBPool()
    getClient().then((c:PoolClient) =>{
        if (c) {
          client = c
          LogInfo(`Connected to PostgreSQL`)
        } else {
          LogError(`Filed to connect to PostgreSQL. ERROR: client not returned from connection pool`)
        }
      })
      .catch(err=>{
        LogError(`Filed to connect to PostgreSQL. ERROR: ${err.message}`)
        dbPool.end()
      })
  },withDelay)
}

// log start of listening
api.addEventListener("listen",()=>{
  //delayed connection
  ConnectDB(3000)
  LogInfo(`server on ${options.port}`)
})

// DENO unload event
window.addEventListener("unload", ()=>{
  LogInfo(`CLOSING DENO....`)
  // console.log("Closing PostgreSQL...")
  if (client) client.release()
});

// listen for close
api.listen(options).then(()=>{
  // Deno.Process.close()
  LogInfo(`CLOSING OAK....`)
})

// await Deno.signal(Deno.Signal.SIGINT);
// console.log("Now we are here");
// Deno.Process.close()

// for await (const _ of Deno.signal(Deno.Signal.SIGINT)) {
//   console.log("Now we are here!");
// }


