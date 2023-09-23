// Next 13 new api handlers
// see https://nextjs.org/docs/app/building-your-application/routing/route-handlers
import { NextResponse } from 'next/server'
import getFiles from "../../../utils/getFiles"


/**
 * Extract image files from public bench folder.
 */
export async function GET(){

  const files = await getFiles("./public/bench")
  const imgDb = files.map(item=>{
    return {
      ...item,
      href: item.path.replace("./public/","/")
    }
  })

  return NextResponse.json(imgDb)
  // res.statusCode = 200
  // res.setHeader("content-type","application/json")
  // res.end(JSON.stringify(imgDb))
}