

const getFiles = require("../../utils/getFiles")

/**
 * Extract image files from public bench folder.
 */
export default async(req,res)=>{

  const files = await getFiles("./public/bench")
  const imgDb = files.map(item=>{ 
    return {
      ...item,
      href: item.path.replace("./public/","/")
    }
  })

  res.statusCode = 200
  res.setHeader("content-type","application/json")
  res.end(JSON.stringify(imgDb))
}