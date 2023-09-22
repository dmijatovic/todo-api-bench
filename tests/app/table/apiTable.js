/**
 * 
 * @returns 
 */
export async function getTableData(file){
  try{
    const resp = await fetch(`http://localhost:3000/api/report/${file}`)
    // console.log("resp...", resp)
    if (resp.status===200){
      const json = await resp.json()
      return json['report']
    }
    console.error("getTableData...", resp.status, resp.statusText)
    return []
  }catch(e){
    console.error("Failed to get db data. ", e.metadata)
    return []
  }
} 