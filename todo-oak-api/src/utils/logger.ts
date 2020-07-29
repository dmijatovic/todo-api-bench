import {Request, Response} from '../../deps.ts'

// Logger is a middleware
export default async ({request, response}:{request:Request, response:Response}, next:any)=>{
  // pass it further but await first for resoltion
  await next()
  // const url:URL = request.url
  // log when returned (for response.status)
  const msg:string = `${Date.now()} ${request.method} ${request.url.pathname} - ${response.status}`
  console.log(msg)
}