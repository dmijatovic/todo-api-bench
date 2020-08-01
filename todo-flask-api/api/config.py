import os

API_ENV=os.environ.get('API_ENV','development')
API_PORT=int(os.environ.get('API_PORT',"8080"))
API_NAME=os.environ.get('API_NAME',"todo-flask_api")

API_RELOAD=bool(os.environ.get('API_RELOAD',"True"))
API_DEBUG=bool(os.environ.get('API_DEBUG',"True"))
API_WORKERS=int(os.environ.get('API_WORKERS',"1"))

# SECRET_KEY=os.environ.get('FOOD_API_SECRET','01545c0cdd271a8177bea35d4d4b0517')
# expiration time in seconds
# EXP_TIME_SEC=os.environ.get('FOOD_API_EXP_TIME_SEC',60*60)
# postgress db connection

PG_POOL_MAX_SIZE = int(os.environ.get("PG_POOL_MAX_SIZE","30"))
SQLALCHEMY_TRACK_MODIFICATIONS=os.environ.get('SQLALCHEMY_TRACK_MODIFICATIONS',True)

def SqlPostgresCnn():
  PG_HOST = os.environ.get("PG_HOST","localhost")
  PG_PORT = int(os.environ.get("PG_PORT","5432"))
  PG_USER = os.environ.get("PG_USER","postgres")
  PG_PASS = os.environ.get("PG_PASS","changeme")
  PG_DB = os.environ.get("PG_DB","todo_db")

  return f'postgresql://{PG_USER}:{PG_PASS}@{PG_HOST}:{PG_PORT}/{PG_DB}'


# SQLALCHEMY_DATABASE_URI=os.environ.get('SQLALCHEMY_DATABASE_URI','postgresql://postgres:changeme@localhost/todo_db')
