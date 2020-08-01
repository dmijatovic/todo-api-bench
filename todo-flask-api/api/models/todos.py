# from sqlalchemy.dialects.postgresql import Serial
from api import db

class TodoList(db.Model):
  __tablename__ = "todo_list"
  id = db.Column(db.Integer, nullable=False, primary_key=True)
  title = db.Column(db.String(100),nullable=False)

  def __repr__(self):
    return f'TodoList {self.title}'

  def toJson(self):
    return {
      "id": self.id,
      "title": self.title
    }

class TodoItem(db.Model):
  __tablename__ = "todo_item"
  id = db.Column(db.Integer, nullable=False, primary_key=True)
  title = db.Column(db.String(100),nullable=False)
  checked = db.Column(db.Boolean, nullable=False, default=False)
  list_id = db.Column(db.Integer, nullable=False, foreign_key="todo_list.id")

  def __repr__(self):
    return f'TodoItem {self.title}'

  def toJson(self):
    return {
      "id": self.id,
      "title": self.title
    }
