
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
  res.end(resp.respOK(res,{response:"It works"}))
})


// TODO LIST
api.post("/list", todos.addTodoList)
api.put("/list", todos.updateTodoList)
api.get("/list/:lid", todos.getTodoList)
api.get("/list", todos.getAllTodoLists)

//TODO ITEMS
api.post("/todo", todos.addTodoItem)
api.put("/todo/:id", todos.updateTodoItem)
api.delete("/todo/:id", todos.deleteTodoItem)
api.get("/todo/list/:lid", todos.getTodoItems)
api.get("/todo/:id", todos.getTodoItem)

module.exports={
  api,
  PORT
}