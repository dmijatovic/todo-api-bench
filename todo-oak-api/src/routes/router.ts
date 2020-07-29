import {Router} from "../../deps.ts"

import Home from "./home.ts"
import * as todos from "./todos.ts"

const router = new Router()

// TODO LIST
router.get("/",Home)
  .get("/todos", todos.getAllTodoLists)
  .post("/todos", todos.addTodoList)
  .put("/todos",todos.updateTodoList)
  .delete("/todos/:id", todos.deleteTodoList)

// TODO ITEM
router.get("/todos/:lid/items", todos.getTodoItems)
  .post("/todos/:lid/items", todos.addTodoItem)
  .put("/todos/item", todos.updateTodoItem)
  .delete("/todos/item/:id", todos.deleteTodoItem)

export default router