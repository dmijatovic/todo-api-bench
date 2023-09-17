
function writeHead(res, status=200){
  res.writeHead(status,{
    'Content-Type': 'application/json',
    'x-server':"polka-nodejs"
  })
}

function respOK(res, data={}){
  const json = JSON.stringify(data)
  writeHead(res,200)
  res.end(json)
}

function respErr(res, status=500,errorText="Internal server error"){
  const json = JSON.stringify({
    status,
    statusText: errorText,
    payload: null
  })
  writeHead(res,status)
  res.end(json)
}

module.exports={
  respOK,
  respErr
}