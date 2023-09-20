
const polka = require('polka')
const {json} = require('body-parser')

const getEnv = require('./utils/getEnv')
const resp = require("./utils/resp")
// const config = require("./api.config")
const {loggerMiddleware} = require('./utils/log')
const todos = require('./routes/todos')

const PORT = parseInt(getEnv('API_PORT', '8080'))

const api = polka()
  .use(json())
  .use(loggerMiddleware)

// Home route (not protected)
api.get("/",(req,res)=>{
  res.end(resp.respOK(res,{status:"OK"}))
})


// TODO LIST
api.get("/list", todos.getAllTodoLists)
api.post("/list", todos.addTodoList)
api.put("/list/:lid", todos.updateTodoList)
api.get("/list/:lid", todos.getTodoList)
api.delete("/list/:lid", todos.deleteTodoList)

//TODO ITEMS
api.post("/todo", todos.addTodoItem)
api.put("/todo/:id", todos.updateTodoItem)
api.get("/todo/:id", todos.getTodoItem)
api.delete("/todo/:id", todos.deleteTodoItem)

api.get("/list/:lid/todo", todos.getTodoItems)

module.exports={
  api,
  PORT
}