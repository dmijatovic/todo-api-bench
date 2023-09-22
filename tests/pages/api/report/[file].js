const fs = require("fs");
const ldb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

function getLowdbData(file){
  let fileName = './report/db.json'
  if (file){
    fileName = `./report/${file}`
  }
  if (fs.existsSync(fileName)) {
    const adapter = new FileSync(fileName)
    const db = ldb(adapter)
    const data = db.read()
  
    return data 
  }else{
    throw new Error("File not found")
  }
}


export default async function handler(req,res){
try{
  const {file} = req.query
  // console.log("file...", file)

  if (file.endsWith(".json")===false){
    return res.status(400).json({message:"JSON extension expected in filename"})
  }
  // get data from db file
  const data = getLowdbData(file)
  // console.log("data...", data)
  // return json data
  res.status(200).json(data)
}catch(e){
  res.status(500).json({message: e.message})
}}