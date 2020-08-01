import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request,jsonify
from api import app

def createToken(data):
  """ Utility function to create JWT """
  # print("EXP_TIME_SEC...", app.config['EXP_TIME_SEC'])
  expTime = datetime.utcnow() + timedelta(seconds=int(app.config['EXP_TIME_SEC']))
  print("expTime...", str(expTime))
  # encode jwt (payload as {} and secret)
  token = jwt.encode({'data': data,'exp': expTime}, app.config['SECRET_KEY'])
  # token is in byte format and need to be decoded
  # return jsonify({'token': token.decode('UTF-8')})
  return token.decode('UTF-8')


def protectedRouteBearer(fn):
  @wraps(fn)
  def decorated(*args,**kwargs):
    auth = request.headers.get('authorization')

    if app.config['ENV']=='development':
      print("development ENV skips JWT validation")
      return fn(*args,**kwargs)

    if not auth:
      return jsonify({'message':'Token is missing'}), 401

    _bearer,token = auth.split(" ")

    if not token:
      return jsonify({'message':'Token is missing'}), 401
    try:
      data = jwt.decode(token, app.config['SECRET_KEY'])
    except:
      return jsonify({'message':'Token is NOT VALID!'}), 401

    return fn(*args,**kwargs)
  return decorated


# def protected_route(fn):
#   @wraps(fn)
#   def decorated(*args,**kwargs):
#     token = request.args.get('token')

#     if not token:
#       return jsonify({'message':'Token is missing'}), 401
#     try:
#       data = jwt.decode(token, app.config['SECRET_KEY'])
#     except:
#       return jsonify({'message':'Token is NOT VALID!'}), 403

#     return fn(*args,**kwargs)

#   return decorated