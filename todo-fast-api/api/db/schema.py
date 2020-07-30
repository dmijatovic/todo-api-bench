from pydantic import BaseModel

class BaseTodoList(BaseModel):
  title:str

class TodoList(BaseTodoList):
  id:int

class BaseTodoItem(BaseModel):
  title:str
  checked: bool

class TodoItem(BaseTodoItem):
  id: int
  list_id: int