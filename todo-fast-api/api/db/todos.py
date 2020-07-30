from api.db import database as db
from api.db import schema

# ---------------------------
# TODO LIST QUERIES

async def GetAllTodoLists():
  sql="SELECT id, title from todo_list;"
  rows = await db.fetch_all(query=sql)
  return rows

async def AddTodoList(title:str):
  sql="INSERT INTO todo_list (title) VALUES(:title) RETURNING id, title;"
  vals = {"title":title}
  row = await db.fetch_one(query=sql,values=vals)
  return row

async def UpdateTodoList(todoList:schema.TodoList):
  sql="UPDATE todo_list SET title=:title WHERE id=:id RETURNING id, title;"
  vals = {"title":todoList.title,"id":todoList.id}
  row = await db.fetch_one(query=sql,values=vals)
  return row

async def DeleteTodoList(id:int):
  sql="DELETE FROM todo_list WHERE id=:id RETURNING id, title;"
  vals = {"id":id}
  row = await db.fetch_one(query=sql,values=vals)
  return row


# ----------------------------
# TODO ITEM QUERIES

async def GetTodoItems(lid:int):
  sql="SELECT id,list_id,title,checked from todo_item where list_id=:lid;"
  vals = {"lid":lid}
  rows = await db.fetch_all(query=sql,values=vals)
  return rows

async def AddTodoItem(lid:int, todo:schema.BaseTodoItem):
  sql="INSERT INTO todo_item (title,checked, list_id) VALUES(:title,:checked,:list_id) RETURNING id, list_id, title, checked;"
  vals = {"title":todo.title,"checked":todo.checked,"list_id":lid}
  row = await db.fetch_one(query=sql,values=vals)
  return row

async def UpdateTodoItem(todo:schema.TodoItem):
  sql="UPDATE todo_item SET title=:title, checked=:checked, list_id=:list_id WHERE id=:id RETURNING id, list_id, title, checked;"
  vals = {"title":todo.title,"checked":todo.checked,"list_id":todo.list_id, "id":todo.id}
  row = await db.fetch_one(query=sql,values=vals)
  return row

async def DeleteTodoItem(id:int):
  sql="DELETE FROM todo_item WHERE id=:id RETURNING id,list_id,title, checked;"
  vals = {"id":id}
  row = await db.fetch_one(query=sql,values=vals)
  return row