from flask_sqlalchemy import BaseQuery
from data import getPropsFromClass


class Test():
  _dontusethis="This is my internal prop"
  test_1="test 124"
  test_2="test 234"
  test_3="test 345"
  test_4=None
  k=2
  query = BaseQuery({})
  def myMethod():
    print("This is my methods")


nevo = Test()

data = getPropsFromClass(nevo)

print(data)

