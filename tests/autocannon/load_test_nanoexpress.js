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
const TEST_TITLE = "todo-nanoexpress-api"
// update base url from env
utils.settings.url = "http://localhost:8089"

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
      method:'POST',
      path:'/list',
      headers:{
        'content-type':'application/json',
        'autohorization':'Bearer FAKE_JWT_KEY'
      },
      body:JSON.stringify(utils.todoList),
      onResponse:(status, body, context)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "POST/list",
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
      method:'PUT',
      setupRequest:(req, context)=>({
        ...req,
        path:'/list',
        headers:{
          'content-type':'application/json',
          'autohorization':'Bearer FAKE_JWT_KEY'
        },
        body:JSON.stringify({
          id: context['list_id'],
          title:"Autocannon title update"
        })
      }),
      onResponse:(status)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "PUT/list",
          statusByRoute
        )
      }
    },{
      method: 'POST',
      setupRequest:(req, context)=>({
        ...req,
        path:`/todo`,
        headers:{
          'content-type':'application/json',
          'autohorization':'Bearer FAKE_JWT_KEY'
        },
        body:JSON.stringify(utils.todoItemForList(context['list_id']))
      }),
      onResponse:(status, body, context)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "POST/todo",
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
        }else{
          context['todo_id'] = 1;
        }
      }
    },{
      setupRequest:(req, context)=>({
        ...req,
        method:'PUT',
        path:`/todo/${context['todo_id']}`,
        headers:{
          'content-type':'application/json',
          'autohorization':'Bearer FAKE_JWT_KEY'
        },
        body:JSON.stringify(utils.todoItemUpdate(
          context['list_id'],
          context['todo_id']
        ))
      }),
      onResponse:(status, body, context)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          `PUT/todo/{todo_id}`,
          statusByRoute
        )
      }
    },{
      method:'GET',
      path:'/list',
      onResponse:(status)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "GET/list",
          statusByRoute
        )
      }
    },{
      method: 'GET',
      setupRequest:(req, context)=>({
        ...req,
        path:`/todo/list/${context['list_id']}`,
        headers:{
          'content-type':'application/json',
          'autohorization':'Bearer FAKE_JWT_KEY'
        }
      }),
      onResponse:(status)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "GET/todo/list/{list_id}",
          statusByRoute
        )
      }
    },{
      method: 'GET',
      setupRequest:(req, context)=>({
        ...req,
        path:`/todo/${context['todo_id']}`,
        headers:{
          'content-type':'application/json',
          'autohorization':'Bearer FAKE_JWT_KEY'
        }
      }),
      onResponse:(status)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "GET/todo/{todo_id}",
          statusByRoute
        )
      }
    },{
      method:"DELETE",
      setupRequest:(req, context)=>({
        ...req,
        path:`/todo/${context['todo_id']}`,
        headers:{
          'content-type':'application/json',
          'autohorization':'Bearer FAKE_JWT_KEY'
        }
      }),
      onResponse:(status)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "DELETE/todo/{todo_id}",
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