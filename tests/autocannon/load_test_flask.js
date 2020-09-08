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
    }
  })
}

const loadTest = autocannon({
  ...utils.settings,
  title:"todo-flask-api",
  url:"http://localhost:8087",
  requests:[{
      method:'GET',
      path:'/api',
    },{
      method:'POST',
      path:'/api/todos',
      headers:{
        'content-type':'application/json',
        'autohorization':'Bearer FAKE_JWT_KEY'
      },
      body:JSON.stringify(utils.todoList),
      onResponse:(status, body, context)=>{
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
        path:`/api/todos`,
        headers:{
          'content-type':'application/json',
          'autohorization':'Bearer FAKE_JWT_KEY'
        },
        body:JSON.stringify({
          id: context['list_id'],
          title:"Autocannon title update"
        })
      })
    },{
      method: 'POST',
      setupRequest:(req, context)=>({
        ...req,
        path:`/api/todos/${context['list_id']}/items`,
        headers:{
          'content-type':'application/json',
          'autohorization':'Bearer FAKE_JWT_KEY'
        },
        body:JSON.stringify(utils.todoItem),
      }),
      onResponse:(status, body, context)=>{
        if (status === 200) {
          const resp = JSON.parse(body)
          if (resp && resp['payload'] && resp['payload']['id']){
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
        path:`/api/todos/${context['list_id']}/items`,
        headers:{
          'content-type':'application/json',
          'autohorization':'Bearer FAKE_JWT_KEY'
        }
      })
    },{
      method:"DELETE",
      setupRequest:(req, context)=>{
        let id=1
        if (context['todo_id']){
          id=context['todo_id']
        }
        return {
          ...req,
          path:`/api/todos/item/${id}`,
          headers:{
            'content-type':'application/json',
            'autohorization':'Bearer FAKE_JWT_KEY'
          }
        }
      }
    }
  ]
},saveResults)

process.once('SIGINT',()=>{
  abort = true
  loadTest.stop()
})

autocannon.track(loadTest)