import {Request, Response} from '../../deps.ts'
import getEnv from "./getEnv.ts"

const APP_NAME = getEnv("APP_NAME","todo-oak-api")

export function LogInfo(message:string){
  const msg:string=`${Date.now()} ${APP_NAME} INFO ${message}`
  console.log(msg)
  // Deno.stdout(msg)
}

export function LogError(message:string){
  const msg:string=`${Date.now()} ${APP_NAME} ERROR ${message}`
  console.error(msg)
}

// Logger is a middleware
export default async ({request, response}:{request:Request, response:Response}, next:any)=>{
  // pass it further but await first for resoltion
  await next()
  // const url:URL = request.url
  // log when returned (for response.status)
  const msg:string = `${request.method} ${request.url.pathname} - ${response.status}`
  LogInfo(msg)
}