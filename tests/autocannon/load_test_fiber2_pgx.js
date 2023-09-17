const autocannon = require('autocannon')
const utils = require('./utils')
const saveAllResults = require('./saveResults')
const {getRequests} = require("./load_test_requests")

// abort flag
let abort = false
// save status rapport
let statusByRoute = {}
// failed create items count
const noId={
  list:0,
  item:0
}
// created items counted
const created={
  list:0,
  item:0
}
// record first core speed at the start of test
const firstCoreStart = {
  time: new Date().toISOString(),
  speed: utils.getCoreSpeed(0)
}

// callback function to save results
function saveResults(err, result){
  if (abort===true) {
    console.log("Load test cancelled...")
    return
  }
  // record first core speed at the end of test
  saveAllResults({
    err,result,
    noId,created,
    firstCoreStart,
    statusByRoute
  })
}

// create autocannon instance
const loadTest = autocannon({
  ...utils.settings,
  // overwrite default settings
  title: "todo-fiber2-pgx",
  url: "http://localhost:8080",
  // get all default request
  // NOTE! pass object by refference to count stats
  requests: getRequests(statusByRoute, noId, created)
  // callback function to write all results
},saveResults)

// listen to cancel
process.once('SIGINT',()=>{
  abort = true
  loadTest.stop()
})

// start test
autocannon.track(loadTest)