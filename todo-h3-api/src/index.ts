import {listen} from 'listhen'
import {createApp} from 'h3'
import {loggerMiddleware} from './utils/log'
import getEnv from './utils/getEnv'

import {
  GetAllTodoLists,
  AddTodoList,
  UpdateTodoList,
  AddTodoItem,
  UpdateTodoItem,
  GetTodoItems,
  GetTodoItem,
  DeleteTodoItem
} from './db/todos'

const PORT = getEnv("API_PORT","8091")

const app = createApp()

app.use(loggerMiddleware)

app.use("/list",GetAllTodoLists,
  {match:(url,req) => req?.method==="GET"}
)
app.use("/list", AddTodoList,
  {match:(url,req) => req?.method==="POST"}
)
app.use("/list", UpdateTodoList,
  {match:(url,req) => req?.method==="PUT"}
)
app.use("/todo/list", GetTodoItems,
  {match:(url,req) => req?.method==="GET"}
)
app.use("/todo", GetTodoItem,
  {match:(url,req) => req?.method==="GET"}
)
app.use("/todo", AddTodoItem,
  {match:(url,req) => req?.method==="POST"}
)
app.use("/todo", UpdateTodoItem,
  {match:(url,req) => req?.method==="PUT"}
)
app.use("/todo", DeleteTodoItem,
  {match:(url,req) => req?.method==="DELETE"}
)

app.use("/",()=>{
  return {
    message:"h3 api server active!"
  }
})

listen(app,{port:PORT})