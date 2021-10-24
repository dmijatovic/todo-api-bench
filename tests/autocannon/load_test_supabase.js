const autocannon = require('autocannon')
const utils = require('./utils')
const saveAllResults = require('./saveResults')

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
const TEST_TITLE = "todo-supabase-api"
// supabase requires token
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpYXQiOiAxNjM0NzY3MjAwLAogICAgImV4cCI6IDE3OTI1MzM2MDAKfQ.bo4PuooVKqKLC3C3tKDUQe09LKD04TdWKtJeKrTg5Wc'
// update base url from env
utils.settings.url = "http://localhost:8000"
// record first core speed at the start of test
const firstCoreStart = {
  time: new Date().toISOString(),
  speed: utils.getCoreSpeed(0)
}

function saveResults(err, result){
  if (abort===true) {
    console.log("Load test cancelled...")
    return
  }
  // save all stats
  saveAllResults({
    err,result,
    noId,created,
    firstCoreStart,
    statusByRoute
  })
}

const loadTest = autocannon({
  ...utils.settings,
  title:TEST_TITLE,
  requests:[{
      method:'GET',
      path:'/rest/v1/todo_list?limit=50&offset=0',
      headers:{
        'apikey': token,
        'prefer': 'count=exact'
      },
      onResponse:(status)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "GET/todo_list",
          statusByRoute
        )
      }
    },{
      method:'POST',
      path:'/rest/v1/todo_list',
      headers:{
        'accept': 'application/json',
        'content-type':'application/json',
        'apikey': token,
        'prefer': 'return=representation'
      },
      body:JSON.stringify(utils.todoList),
      onResponse:(status, body, context)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "POST/todo_list",
          statusByRoute
        )
        if (status === 201) {
          // supbase does not returns the value
          const resp = JSON.parse(body)
          if (resp && resp[0] && resp[0]['id']){
            context['list_id'] = resp[0]['id']
            created.list+=1
          }else{
            noId.list+=1
          }
        }
      }
    },{
      method:'PATCH',
      setupRequest:(req, context)=>({
        ...req,
        path:`/rest/v1/todo_list?id=eq.${context['list_id'] || 1}`,
        headers:{
          'content-type':'application/json',
          'apikey': token,
          'prefer': 'return=representation'
        },
        body:JSON.stringify({
          title:"Autocannon title update"
        })
      }),
      onResponse:(status)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "PATCH/todo_list?id=eq.${list_id}",
          statusByRoute
        )
      }
    },{
      method: 'POST',
      setupRequest:(req, context)=>({
        ...req,
        path:`/rest/v1/todo_item`,
        headers:{
          'accept': 'application/json',
          'content-type':'application/json',
          'apikey': token,
          'prefer': 'return=representation'
        },
        body:JSON.stringify(utils.todoItemForList(context['list_id']||1))
      }),
      onResponse:(status, body, context)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "POST/todo_item",
          statusByRoute
        )
        if (status === 201) {
          const resp = JSON.parse(body)
          if (resp && resp[0] && resp[0]['id']){
            context['todo_id'] = resp[0]['id']
            created.item+=1
          }else{
            noId.item+=1
          }
        }
      }
    },{
      setupRequest:(req, context)=>({
        ...req,
        method:'PATCH',
        path:`/rest/v1/todo_item?id=eq.${context['todo_id']||1}`,
        headers:{
          'accept': 'application/json',
          'content-type':'application/json',
          'apikey': token,
          'prefer': 'return=representation'
        },
        body:JSON.stringify({
          // PATCH supports sigle update
          checked:true
        })
      }),
      onResponse:(status, body, context)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "PATCH/todo_item?id=eq.${todo_id}",
          statusByRoute
        )
      }
    },{
      method:'GET',
      path:'/rest/v1/todo_item?limit=50&offset=0',
      headers:{
        'apikey': token,
        'prefer': 'count=exact'
      },
      onResponse:(status)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "GET/todo_item",
          statusByRoute
        )
      }
    },{
      method: 'GET',
      setupRequest:(req, context)=>({
        ...req,
        path:`/rest/v1/todo_item?list_id=eq.${context['list_id']||1}&limit=50`,
        headers:{
          'apikey': token,
          'prefer': 'count=exact'
        },
      }),
      onResponse:(status)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "GET/todo_item?list_id=eq.${list_id}",
          statusByRoute
        )
      }
    },{
      method: 'GET',
      setupRequest:(req, context)=>({
        ...req,
        path:`/rest/v1/todo_item?id=eq.${context['todo_id']||1}`,
        headers:{
          'apikey': token,
          'prefer': 'count=exact'
        },
      }),
      onResponse:(status)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "GET/todo_item?id=eq.${todo_id}",
          statusByRoute
        )
      }
    },{
      method:"DELETE",
      setupRequest:(req, context)=>({
        ...req,
        path:`/rest/v1/todo_item?id=eq.${context['todo_id']||1}`,
        headers:{
          'apikey': token,
          'prefer': 'count=exact'
        },
      }),
      onResponse:(status)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "DELETE/todo_item?id=eq.${todo_id}",
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