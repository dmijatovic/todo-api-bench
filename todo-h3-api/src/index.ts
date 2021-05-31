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

const PORT = getEnv("PORT","8080")

const app = createApp()

app.use(loggerMiddleware)

app.useAsync("/list",GetAllTodoLists,
  {match:(url,req) => req?.method==="GET"}
)
app.useAsync("/list", AddTodoList,
  {match:(url,req) => req?.method==="POST"}
)
app.useAsync("/list", UpdateTodoList,
  {match:(url,req) => req?.method==="PUT"}
)
app.useAsync("/todo/list", GetTodoItems,
  {match:(url,req) => req?.method==="GET"}
)
app.useAsync("/todo", GetTodoItem,
  {match:(url,req) => req?.method==="GET"}
)
app.useAsync("/todo", AddTodoItem,
  {match:(url,req) => req?.method==="POST"}
)
app.useAsync("/todo", UpdateTodoItem,
  {match:(url,req) => req?.method==="PUT"}
)
app.useAsync("/todo", DeleteTodoItem,
  {match:(url,req) => req?.method==="DELETE"}
)

app.useAsync("/",()=>{
  return {
    message:"h3 api server active!"
  }
})

listen(app,{port:PORT})