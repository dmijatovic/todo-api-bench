module.exports = (key, defaultVal)=>{
  let value
  try{
    value = process.env[key]
    if (value){
      return value
    }
    console.log(`${key} MISSING using default...${defaultVal}`)
    return defaultVal
  }catch{
    console.log(`${key} MISSING using default...${defaultVal}`)
    return defaultVal
  }
}