import { Context } from 'elysia';
import {IncomingMessage,ServerResponse} from 'http';

export function logInfo(message="", service="todo-bun-pgjs"){
  const log=`${Date.now()} ${service} ${message}\n`
  process.stdout.write(log)
}

export function logError(message = "", service ="todo-bun-pgjs"){
  const err=`${Date.now()} ${service} ${message}\n`
  process.stderr.write(err)
}

export function loggerMiddleware(req:IncomingMessage, res:ServerResponse, next:Function){
  logInfo(`${req.method} ${res.statusCode} ${req.url}`)
  next()
}

export function loggerHook(ctx:Context) {
  console.log("loggerHook...", ctx)
  logInfo(`${ctx.request.method} ${ctx.path}`)
}