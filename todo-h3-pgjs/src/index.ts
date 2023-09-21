import {listen} from 'listhen'
import {
  createApp, fromNodeMiddleware,
  createRouter, toNodeListener, eventHandler
} from 'h3'
import {loggerMiddleware} from './utils/log'
import getEnv from './utils/getEnv'

import {
  GetAllTodoLists,
  AddTodoList,
  UpdateTodoList,
  GetTodoList,
  DeleteTodoList,
  AddTodoItem,
  UpdateTodoItem,
  GetTodoItem,
  DeleteTodoItem,
  GetTodoItems
} from './db/todos'

const PORT = getEnv("API_PORT","8080")

const app = createApp()

// use node middleware
app.use(fromNodeMiddleware(loggerMiddleware))

const router = createRouter()
  // homepage
  .get("/", eventHandler((e) => {
    return {status: "OK" }
  }))

// List
router.use("/list", eventHandler(GetAllTodoLists),"get")
router.use("/list", eventHandler(AddTodoList),"post")
router.use("/list/:lid", eventHandler(GetTodoList), "get")
router.use("/list/:lid", eventHandler(UpdateTodoList), "put")
router.use("/list/:lid", eventHandler(DeleteTodoList), "delete")

// Todo items
router.use("/todo", eventHandler(AddTodoItem), "post")
router.use("/todo/:id", eventHandler(UpdateTodoItem), "put")
router.use("/todo/:id", eventHandler(GetTodoItem), "get")
router.use("/todo/:id", eventHandler(DeleteTodoItem), "delete")

// get todo items of list
router.use("/list/:lid/todo", eventHandler(GetTodoItems), "get")

// register router
app.use(router)

listen(toNodeListener(app),{port:PORT})