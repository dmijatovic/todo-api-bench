
const ldb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./report/db.json')
const db = ldb(adapter)
const data = db.read()

function sendOKResponse(res, data){
  res.statusCode = 200
  res.setHeader("content-type","application/json")
  res.end(JSON.stringify(data))
}

export default (req, res)=>{
  if (data){
    sendOKResponse(res, data)
  }else{
    sendOKResponse(res,{data:"Failed to load json from lowdb"})
  }
}