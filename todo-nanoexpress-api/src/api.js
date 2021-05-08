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
api.get("/todos", todos.GetAllTodoLists)
api.post("/todos", todos.AddTodoList)
api.put("/todos", todos.UpdateTodoList)
api.del("/todos/:id", todos.DeleteTodoList)

//TODO ITEMS
api.get("/todos/:lid/items", todos.GetTodoItems)
api.post("/todos/:lid/items", todos.AddTodoItem)
api.put("/todos/item", todos.UpdateTodoItem)
api.del("/todos/item/:id", todos.DeleteTodoItem)

module.exports={
  api,
  PORT
}
