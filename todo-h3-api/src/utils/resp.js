
function writeHead(res, status=200){
  res.writeHead(status,{
    'Content-Type': 'application/json',
    'x-server':"polka-nodejs"
  })
}

export function respOK(res, data={}){
  const json = JSON.stringify({
    status:200,
    statusText: "OK",
    payload: data
  })
  writeHead(res,200)
  res.end(json)
}

export function respErr(res, status=500,errorText="Internal server error"){
  const json = JSON.stringify({
    status,
    statusText: errorText,
    payload: null
  })
  writeHead(res,status)
  res.end(json)
}
