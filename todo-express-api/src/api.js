
const express = require('express')

const getEnv = require('./utils/getEnv')
const resp = require("./utils/resp")
const {loggerMiddleware} = require('./utils/log')
const todos = require('./routes/todos')

const PORT = parseInt(getEnv('API_PORT', '8080'))

const api = express()

//middleware
api.use(express.json())
api.use(loggerMiddleware)

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