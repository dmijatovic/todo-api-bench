/**
 * 
 * @returns 
 */
export async function getDataList(){
  try{
    const resp = await fetch("http://localhost:3000/api/db")
    // console.log("resp...", resp)
    if (resp.status===200){
      const json = await resp.json()
      return json
    }
    console.error("getDataList...", resp.status, resp.statusText)
    return []
  }catch(e){
    console.error("Failed to get db list. ", e.metadata)
    return []
  }
} 