import {Elysia } from "elysia"
import getEnv from "./utils/getEnv";
import { logInfo } from "./utils/log"
import db,{dbConnect} from "./db/pgdb"
import {
  addTodoItem, deleteTodoItem,
  deleteTodoList, getHome, getTodoItem,
  getTodoItems, getTodoList, getTodoLists,
  postTodoList, updateTodoItem, updateTodoList
} from "./api"

const PORT = getEnv("API_PORT", "8080")

// create server
const app = new Elysia()

// try to connect to database
dbConnect()

// DEFINE ROUTES
app.get("/", getHome)

// list
app.get("/list", getTodoLists)
app.get("/list/:id", getTodoList)
app.post("/list", postTodoList)
app.put("/list", updateTodoList)
app.delete("/list/:id", deleteTodoList)

// ITEMS
// get items of an list
app.get("/todos/list/:id", getTodoItems)
// add item to list
app.post("/todos/list/:id", addTodoItem)
// get item
app.get("/todo/:id", getTodoItem)
// update todo item
app.put("/todo/:id", updateTodoItem)
// delete todo item
app.delete("/todo/:id", deleteTodoItem)

// start listening
app.listen(PORT)

// listen to container/process stop
process.on("SIGINT", async() => {
  logInfo("Closing server on SIGINT")
  await db.end()
  await app.stop()
  process.exit(0)
})

process.on("SIGTERM", async() => {
  logInfo("Closing server on SIGTERM")
  await db.end()
  await app.stop()
  process.exit(0)
})

// LOG
logInfo(`${app.server?.hostname}:${app.server?.port}...started`)
