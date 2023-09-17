
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
  res.end(resp.respOK(res,{status:"OK"}))
})


// TODO LIST
api.get("/list", todos.getAllTodoLists)
api.post("/list", todos.addTodoList)
api.get("/list/:lid", todos.getTodoList)
api.put("/list/:lid", todos.updateTodoList)
api.delete("/list/:lid", todos.deleteTodoList)

//TODO ITEMS
api.post("/todo", todos.addTodoItem)
api.get("/todo/:id", todos.getTodoItem)
api.put("/todo/:id", todos.updateTodoItem)
api.delete("/todo/:id", todos.deleteTodoItem)

// get items of an list
api.get("/list/:lid/todo", todos.getTodoItems)

module.exports={
  api,
  PORT
}