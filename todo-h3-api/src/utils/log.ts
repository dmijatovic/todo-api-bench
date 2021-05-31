import {IncomingMessage,ServerResponse} from 'http';

export function logInfo(message="", service="todo-h3-api"){
  const log=`${Date.now()} ${service} ${message}\n`
  process.stdout.write(log)
}

export function logError(message="", service="todo-h3-api"){
  const err=`${Date.now()} ${service} ${message}\n`
  process.stderr.write(err)
}

export function loggerMiddleware(req:IncomingMessage, res:ServerResponse, next:Function){
  logInfo(`${req.method} ${res.statusCode} ${req.url}`)
  next()
}