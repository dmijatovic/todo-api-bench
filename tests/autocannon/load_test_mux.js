const autocannon = require('autocannon')
const utils = require('./utils')

let abort=false
const noId={
  list:0,
  item:0
}
const created={
  list:0,
  item:0
}

let statusByRoute={}

// get test title from env
const TEST_TITLE = "todo-mux-api"
// update base url from env
utils.settings.url = "http://localhost:8081"


function saveResults(err, result){
  if (abort===true) {
    console.log("Load test cancelled...")
    return
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
    statusByRoute
  })
}

const loadTest = autocannon({
  ...utils.settings,
  title:TEST_TITLE,
  requests:[{
      method:'GET',
      path:'/',
      onResponse:(status)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "GET/",
          statusByRoute
        )
      }
    },{
      method:'GET',
      path:'/todos/',
      onResponse:(status)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "GET/todos",
          statusByRoute
        )
      }
    },{
      method:'POST',
      path:'/todos/',
      headers:{
        'content-type':'application/json',
        'autohorization':'Bearer FAKE_JWT_KEY'
      },
      body:JSON.stringify(utils.todoList),
      onResponse:(status, body, context)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "POST/todos",
          statusByRoute
        )
        if (status === 200) {
          const resp = JSON.parse(body)
          if (resp && resp['payload']){
            context['list_id'] = resp['payload']['id']
            created.list+=1
          } else {
            noId.list+=1
          }
        }
      }
    },{
      method: 'POST',
      setupRequest:(req, context)=>({
        ...req,
        path:`/todos/${context['list_id']}/items`,
        headers:{
          'content-type':'application/json',
          'autohorization':'Bearer FAKE_JWT_KEY'
        },
        body:JSON.stringify(utils.todoItem)
      }),
      onResponse:(status, body, context)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "POST/todos/{list_id}/items",
          statusByRoute
        )
        if (status === 200) {
          const resp = JSON.parse(body)
          if (resp && resp['payload']){
            context['todo_id'] = resp['payload']['id']
            created.item+=1
          }else{
            noId.item+=1
          }
        }
      }
    },{
      method: 'GET',
      setupRequest:(req, context)=>({
        ...req,
        path:`/todos/${context['list_id']}/items`,
        headers:{
          'content-type':'application/json',
          'autohorization':'Bearer FAKE_JWT_KEY'
        }
      }),
      onResponse:(status, body, context)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          `GET/todos/{list_id}/items`,
          statusByRoute
        )
      }
    }
  ]
},saveResults)

process.once('SIGINT',()=>{
  abort = true
  loadTest.stop()
})

autocannon.track(loadTest)