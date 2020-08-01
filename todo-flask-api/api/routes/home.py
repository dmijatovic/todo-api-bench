from api import app
from api.utils.data import wrapResponse

@app.route("/",methods=["GET"])
def home():
  return wrapResponse({'message':"It works"})