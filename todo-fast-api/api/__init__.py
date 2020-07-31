import sys
from time import sleep
from fastapi import FastAPI
from api.db import database
# from fastapi.staticfiles import StaticFiles

api=FastAPI()


@api.on_event("startup")
async def startup():
  try:
    sleep(3)
    await database.connect()
    print("Connected to PostgreSQL...")
  except Exception as e:
    print("Failed to connect to DB:", str(e))
    sys.exit()

@api.on_event("shutdown")
async def shutdown():
  print("Closing db...")
  await database.disconnect()


from api.route import handler