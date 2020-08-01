
from api.config import API_PORT, API_DEBUG
from api import app


if __name__=="__main__":
  app.run(port=API_PORT, debug=API_DEBUG)