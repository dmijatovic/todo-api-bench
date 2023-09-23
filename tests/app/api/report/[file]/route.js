import { NextResponse } from 'next/server'
import fs from "fs"
import ldb from "lowdb"
import FileSync from "lowdb/adapters/FileSync"

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

export async function GET(req,{params}) {
  try {
    const {file} = params
    // console.log("file...", file)

    if (file.endsWith(".json") === false) {
      // return error message with propper status code
      return NextResponse.json({error:"JSON extension expected in filename"},{ status: 400 })
    }
    // get data from db file
    const data = getLowdbData(file)
    // return data
    return NextResponse.json(data)
  } catch (e) {
    // return error message with propper status code
    return NextResponse.json({ error: e.message },{status:500})
  }
}
