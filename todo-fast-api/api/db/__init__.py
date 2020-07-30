import databases

from api import config

# create connection
cnn = config.SqlPostgresCnn()
# print("DBCnn:", cnn)
database = databases.Database(cnn)



