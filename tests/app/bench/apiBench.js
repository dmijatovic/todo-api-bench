/**
 * 
 * @returns 
 */
export async function getImageList(){
  try{
    const resp = await fetch("http://localhost:3000/api/bench")
    // console.log("resp...", resp)
    if (resp.status===200){
      const json = await resp.json()
      return json
    }
    console.error("getImageList...", resp.status, resp.statusText)
    return []
  }catch(e){
    console.error("Failed to get image list. ", e.metadata)
    return []
  }
} 