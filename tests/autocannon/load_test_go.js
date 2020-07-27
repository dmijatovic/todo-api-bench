const autocannon = require('autocannon')
const utils = require('./utils')

let abort=false

function saveResults(err, result){
  if (abort===true) {
    console.log("Load test cancelled...")
    return
  }
  utils.saveToLowdb(err,result)
}

const loadTest = autocannon({
  ...utils.settings,
  title:"todo-go-http",
  url:"http://localhost:8081",
  requests:[{
      method:'GET',
      path:'/',
    },{
      method:'POST',
      path:'/todos/',
      headers:{
        'content-type':'application/json',
        'autohorization':'Bearer FAKE_JWT_KEY'
      },
      body:JSON.stringify(utils.todoList),
      onResponse:(status, body, context)=>{
        if (status === 200) {
          const resp = JSON.parse(body)
          context['list_id'] = resp['payload']['id']
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
      })
    },{
      method: 'GET',
      setupRequest:(req, context)=>({
        ...req,
        path:`/todos/${context['list_id']}/items`,
        headers:{
          'content-type':'application/json',
          'autohorization':'Bearer FAKE_JWT_KEY'
        }
      })
    }
  ]
},saveResults)

process.once('SIGINT',()=>{
  abort = true
  loadTest.stop()
})

autocannon.track(loadTest)