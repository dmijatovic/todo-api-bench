
function writeHead(res, status=200){
  res.writeHead(status,{
    'Content-Type': 'application/json',
    'x-server':"nanoexpress"
  })
}

function respOK(res, data={}){
  const json = JSON.stringify({
    status:200,
    statusText: "OK",
    payload: data
  })
  writeHead(res,200)
  return res.send(json)
}

function respErr(res, status=500,errorText="Internal server error"){
  const json = JSON.stringify({
    status,
    statusText: errorText,
    payload: null
  })
  writeHead(res,status)
  return res.send(json)
}

module.exports={
  respOK,
  respErr
}