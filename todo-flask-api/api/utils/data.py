def wrapResponse(data, status=200, statusTxt="OK"):
  return {
    "status":status,
    "statusText":statusTxt,
    "payload":data
  }

def wrapError(error):
  return {
    "status":500,
    "statusText":"Server error",
    "error":error
  }

def getPropsFromClass(this):
  props = dir(this)
  # print("props:", props)
  data={}
  for key in props:
    # print("key:", key)
    skip, val = skipProp(this,key)
    if skip == False:
      data[key] = val

  return data

def skipProp(this,key):
  if key[0]=="_" and key[:0]=="_":
    # print("system:", key)
    return True, None
  elif key[0]=="_":
    # print("internal:", key)
    return True, None
  elif key=="metadata":
    # print("metadata:", key)
    return True, None
  else:
    val = getattr(this,key)
    t = str(type(val))
    # print("type:", type(val))
    if callable(val):
      # print("method:", key)
      return True, None
    elif t.find('flask_sqlalchemy.')!=-1:
      # print('remove sqlalchemy objects')
      return True, None
    else:
      # print(key, val)
      return False, val

def getPaginationParams(request):
  if (request.json):
    page = request.json.get('page',1)
    per_page = request.json.get('per_page',10)
    return page,per_page
  else:
    return 1, 10

def getOrderByParams(request):
  if (request.json):
    sort_by = request.json.get('sort_by',None)
    sort_dir = request.json.get('sort_dir',None)
    return sort_by, sort_dir
  else:
    return None, None

def getSearchParams(request):
  if (request.json):
    search_in = request.json.get('search_in', None)
    search_str = request.json.get("search_str", None)
    if search_str:
      search_str = f'%{search_str}%'
    return search_in, search_str
  else:
    return None, None

def getGroupIdParam(request):
  if (request.json):
    groupid = request.json.get('groupid', None)
    return groupid
  else:
    return None