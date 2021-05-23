function logInfo(message="", service="todo-fastify-api"){
  const log=`${Date.now()} ${service} ${message}\n`
  process.stdout.write(log)
}

function logError(message="", service="todo-fastify-api"){
  const err=`${Date.now()} ${service} ${message}\n`
  process.stderr.write(err)
}

function loggerMiddleware(req, res, next){
  logInfo(`${req.method} ${req.url}`)
  next()
}

module.exports = {
  logInfo,
  logError,
  loggerMiddleware
}