
import requests
from functools import wraps
from flask import request,jsonify
from api import app
from sys import exc_info

'''
This function is a hook to authorization server. On each protected request
we make call to authorization point to verify user token. During development
this is localhost:8080/verify and in production using docker-compose it should
be http://oauth:8080/verify
'''
def protectedRouteBearer(fn):
  @wraps(fn)
  def decorated(*args,**kwargs):
    auth = request.headers.get('authorization')

    # if app.config['ENV']=='development':
    #   print("development ENV skips JWT validation")
    #   return fn(*args,**kwargs)

    if not auth:
      return jsonify({'message':'Token is missing'}), 401

    # skip bearer check
    # _bearer,token = auth.split(" ")
    # if not token:
    #   return jsonify({'message':'Token is missing'}), 401

    try:
      valid = verifyToken(auth)
      if valid['status']==200:
        # print("verifyToken...",valid['status'], valid['statusText'])
        # OK allow to proceed
        return fn(*args,**kwargs)
      else:
        return jsonify({'message':valid['statusText']}), valid['status']
    except:
      print("verifyToken...failed:", exc_info())
      return jsonify({'message':'Failed to verify token!'}), 500
  return decorated

def verifyToken(authHeader=None):
  url = app.config['FOOD_OAUTH_URI']
  # print("verifyToken...url...", url)
  # print("authHeader...", authHeader)
  headers = {'Authorization':authHeader}
  # print("start request", url)
  req = requests.get(url,headers=headers)
  return req.json()