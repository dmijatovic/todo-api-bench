from werkzeug.exceptions import NotFound
from flask import request

from api import app, db
from api.models.todos import TodoList, TodoItem
from api.utils.data import wrapResponse, wrapError, getPaginationParams, getOrderByParams

"""
Get all todo lists
"""
def getTodoLists(request):
  # select top 50 items
  page=1
  per_page=50
  paginated = TodoList.query\
      .paginate(page=page,per_page=per_page)

  data = {
    'page':page,
    'per_page':per_page,
    'pages': paginated.pages,
    'total': paginated.total
  }

  if paginated.total==0:
    data['found']=0
    data['items']=[]
  else:
    items=[]
    for item in paginated.items:
      items.append(item.toJson())
    data['items'] = items

  return wrapResponse(data)

"""
Add todo list to todo_list table
"""
def addTodoList(request):
  # create new instance
  tl = TodoList()
  # get data from request
  data = request.json
  # add these to class
  for key in data:
    setattr(tl,key,data[key])
  # add data
  db.session.add(tl)
  db.session.commit()
  # return response
  return wrapResponse(tl.toJson())

"""
Update todo list
"""
def updateTodoList(request):
  id = request.json['id']
  # find todolist
  tl = TodoList.query.filter(TodoList.id==id).first()

  if tl:
    data = request.json
    # add these to class
    for key in data:
      setattr(tl,key,data[key])
    # add data
    db.session.add(tl)
    db.session.commit()
    return wrapResponse(tl.toJson())
  else:
    return wrapResponse(f'TodoList with id: {id} not found!',400,"NOT FOUND"),\
      400

"""
Delete todo list
"""
def deleteTodoList(id):
  tl = TodoList.query.filter(TodoList.id==id).first()

  if tl:
    # add data
    db.session.delete(tl)
    db.session.commit()
    return wrapResponse(tl.toJson())
  else:
    return wrapResponse(f'TodoList with id: {id} not found!',\
      400,"NOT FOUND"), 400

"""
Get top 10 todo items of specific list
"""
def getTodoItems(request,id):
  page=1
  per_page=10

  ti = TodoItem.query\
    .filter(TodoItem.list_id==id)\
    .paginate(page=page,per_page=per_page)

  items=[]
  for item in ti.items:
    items.append(item.toJson())

  return wrapResponse(items)

"""
Add todo item to todo list
"""
def addTodoItem(request, lid):
   # create new instance
  ti = TodoItem()
  # add list id
  ti.list_id = lid
  # get data from request
  data = request.json
  # add these to class
  for key in data:
    setattr(ti,key,data[key])
  # add data
  db.session.add(ti)
  db.session.commit()
  # return response
  return wrapResponse(ti.toJson())

"""
Update todo item
"""
def UpdateTodoItem(request):
  id = request.json['id']
  # find todolist
  ti = TodoItem.query.filter(TodoItem.id==id).first()

  if ti:
    data = request.json
    # add these to class
    for key in data:
      setattr(ti,key,data[key])
    # add data
    db.session.add(ti)
    db.session.commit()
    return wrapResponse(ti.toJson())
  else:
    return wrapResponse(f'TodoItem with id: {id} not found!',400,"NOT FOUND"),\
      400

"""
Delete todo item
"""
def DeleteTodoItem(id):

  ti = TodoItem.query.filter(TodoItem.id==id).first()

  if ti:
    # add data
    db.session.delete(ti)
    db.session.commit()
    return wrapResponse(ti.toJson())
  else:
    return wrapResponse(f'TodoItem with id: {id} not found!',\
      400,"NOT FOUND"), 400


"""
TODOLIST routes
"""

@app.route("/todos",methods=["GET","POST","PUT"])
def todos():
  try:
    if request.method=="GET":
      return getTodoLists(request)
    if request.method=="POST":
      return addTodoList(request)
    if request.method=="PUT":
      return updateTodoList(request)
  except Exception as e:
    return wrapError(str(e))

@app.route("/todos/<id>",methods=["DELETE"])
def deleteList(id:int):
  try:
    return deleteTodoList(id)
  except Exception as e:
    return wrapError(str(e))

"""
TODOS ITEM routes
"""

@app.route("/todos/<lid>/items",methods=["GET","POST"])
def todoItems(lid:int):
  try:
    if request.method=="GET":
      return getTodoItems(request,lid)
    if request.method=="POST":
      return addTodoItem(request,lid)
  except Exception as e:
    return wrapError(str(e))


@app.route("/todos/item",methods=["PUT"])
def updateTodoItem():
  try:
    return UpdateTodoItem(request)
  except Exception as e:
    return wrapError(str(e))

@app.route("/todos/item/<id>",methods=["DELETE"])
def deleteTodoItem(id:int):
  try:
    return DeleteTodoItem(id)
  except Exception as e:
    return wrapError(str(e))