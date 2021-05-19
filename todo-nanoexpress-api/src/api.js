const nanoexpress = require('nanoexpress')

const getEnv = require('./utils/getEnv')
const resp = require("./utils/resp")
const {loggerMiddleware} = require('./utils/log')
const todos = require('./db/todos')

const PORT = parseInt(getEnv('API_PORT', '8080'))

const api = nanoexpress()

api.use(loggerMiddleware)

// Home route (not protected)
api.get("/",(req,res)=>{
  return resp.respOK(res,{response:"It works"})
})

// TODO LIST
api.post("/list", todos.AddTodoList)
api.put("/list", todos.UpdateTodoList)
api.get("/list", todos.GetAllTodoLists)
api.get("/list/:lid", todos.GetTodoList)

//TODO ITEMS
api.post("/todo", todos.AddTodoItem)
api.put("/todo/:id", todos.UpdateTodoItem)
api.del("/todo/:id", todos.DeleteTodoItem)
api.get("/todo/list/:lid", todos.GetTodoItems)
api.get("/todo/:id", todos.GetTodoItem)

module.exports={
  api,
  PORT
}
