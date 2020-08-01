from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# from config import SECRET, EXP, SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from api import config

app = Flask(__name__)

app.config['ENV'] = config.API_ENV
app.config['SQLALCHEMY_DATABASE_URI']=config.SqlPostgresCnn()
# define SQL track modifications in development
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=config.SQLALCHEMY_TRACK_MODIFICATIONS

# db setup
db = SQLAlchemy(app)

# we do not use login and users from flask, moved to go-oauth2
# from api.routes import home,ingredients,login,meals,nevo,users
from api.routes import home, todos
