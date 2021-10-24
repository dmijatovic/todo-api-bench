const utils = require('./utils')

function saveResults({err, result, noId, created, firstCoreStart, statusByRoute}){
  // record first core speed at the end of test
  const firstCoreEnd = {
    time: new Date().toISOString(),
    speed: utils.getCoreSpeed(0)
  }
  utils.saveToLowdb(err,{
    ...result,
    IdNotRetuned:{
      ...noId
    },
    Created:{
      ...created
    },
    system: utils.system,
    coreCnt: utils.coreCnt,
    speedBefore:`${firstCoreStart.speed}MHz`,
    speedAfter:`${firstCoreEnd.speed}MHz`,
    statusByRoute
  })
}

module.exports = saveResults