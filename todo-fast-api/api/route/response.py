
def respOK(data,status=200,statusText="OK"):
  resp={
    "status":status,
    "statusText": statusText,
    "payload": data
  }
  return resp


def respErr(statusText="Server error",status=500,data=None):
  resp={
    "status":status,
    "statusText": statusText,
    "payload": data
  }
  return resp
