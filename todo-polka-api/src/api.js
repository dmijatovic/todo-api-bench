
const polka = require('polka')
const {json} = require('body-parser')
const process = require('process')

const resp = require("./utils/resp")
const config = require("./api.config")
const {loggerMiddleware} = require('./utils/log')

const todos = require('./routes/todos')

const PORT = process.env.API_PORT || config.apiPort || 5000

const api = polka()
  .use(json())
  .use(loggerMiddleware)

// Home route (not protected)
api.get("/",(req,res)=>{
  res.end(resp.respOK(res,{response:"It works"}))
})


// TODO LIST
api.get("/todos", todos.getAllTodoLists)
api.post("/todos", todos.addTodoList)
api.put("/todos", todos.updateTodoList)
api.delete("/todos/:id", todos.deleteTodoList)

//TODO ITEMS
api.get("/todos/:lid/items", todos.getTodoItems)
api.post("/todos/:lid/items", todos.addTodoItem)
api.put("/todos/item", todos.updateTodoItem)
api.delete("/todos/item/:id", todos.deleteTodoItem)

module.exports={
  api,
  PORT
}