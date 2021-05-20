const log = require('./log')

module.exports = (key, defaultVal)=>{
  let value
  try{
    value = process.env[key]
    if (value){
      return value
    }
    log.logInfo(`${key} MISSING using default...${defaultVal}`)
    return defaultVal
  }catch{
    log.logInfo(`${key} MISSING using default...${defaultVal}`)
    return defaultVal
  }
}