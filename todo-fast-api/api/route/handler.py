from fastapi import Response, status
from api import api
from api.db import schema
from api.db import todos
from api.route.response import respOK,respErr

@api.get("/")
async def root():
  return {"message": "Todo FastAPI active"}

#--------------------
# TODO LIST ROUTES

@api.get("/todos")
async def getTodoLists():
  lists = await todos.GetAllTodoLists()
  return respOK(lists)

@api.post("/todos")
async def addTodoList(listItem:schema.BaseTodoList):
  try:
    # print("listItem:", listItem)
    result = await todos.AddTodoList(listItem.title)
    # return {"message": "Add todo list"}
    # print("result:", result)
    return respOK(result)
  except Exception as e:
    return respErr(str(e))

@api.put("/todos")
async def updateTodoList(todoList:schema.TodoList):
  try:
    result = await todos.UpdateTodoList(todoList)
    return respOK(result)
  except Exception as e:
    return respErr(str(e))

@api.delete("/todos/{lid}")
async def deleteTodoList(lid:int, response:Response):
  try:
    result = await todos.DeleteTodoList(lid)
    if result == None:
      response.status_code = status.HTTP_400_BAD_REQUEST
      return respErr("Failed to delete list. Check id",400,result)
    else:
      return respOK(result)
  except Exception as e:
    return respErr(str(e))

#--------------------
# TODO ITEM reoutes

@api.get("/todos/{lid}/items")
async def getTodoItems(lid:int):
  try:
    results = await todos.GetTodoItems(lid)
    return respOK(results)
  except Exception as e:
    return respErr(str(e))

@api.post("/todos/{lid}/items")
async def addTodoItem(lid:int,todo:schema.BaseTodoItem):
  try:
    result = await todos.AddTodoItem(lid,todo)
    return respOK(result)
  except Exception as e:
    return respErr(str(e))

@api.put("/todos/item")
async def updateTodoItem(todo:schema.TodoItem):
  try:
    result = await todos.UpdateTodoItem(todo)
    return respOK(result)
  except Exception as e:
    return respErr(str(e))

@api.delete("/todos/item/{id}")
async def deleteTodoItem(id:int, response:Response):
  try:
    result = await todos.DeleteTodoItem(id)
    if result == None:
      response.status_code = status.HTTP_400_BAD_REQUEST
      return respErr("Failed to delete list. Check id",400,result)
    else:
      return respOK(result)
  except Exception as e:
    return respErr(str(e))