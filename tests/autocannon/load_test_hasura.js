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
  title:"todo-hasura-api",
  url:"http://localhost:8088",
  requests:[{
      method:'POST',
      path:'/v1/graphql',
      headers:{
        'content-type':'application/json',
        'autohorization':'Bearer FAKE_JWT_KEY'
      },
      body:JSON.stringify(utils.qql.getTodoList),
    },{
      method:'POST',
      path:'/v1/graphql',
      headers:{
        'content-type':'application/json',
        'autohorization':'Bearer FAKE_JWT_KEY'
      },
      body:JSON.stringify(utils.qql.addTodoList),
      onResponse:(status, body, context)=>{
        if (status === 200) {
          const resp = JSON.parse(body)
          if (resp && resp[data]){
            context['list_id'] = resp['data']['insert_todo_list_one']['id']
            created.list+=1
          }else{
            noId.list+=1
          }
        }
      }
    },{
      method:'POST',
      path:'/v1/graphql',
      setupRequest:(req, context)=>({
        ...req,
        headers:{
          'content-type':'application/json',
          'autohorization':'Bearer FAKE_JWT_KEY'
        },
        body:JSON.stringify(utils.qql.updateTodoList(
          context['list_id'],"Autocannon title update")
        )
      })
    },{
      method: 'POST',
      path:'/v1/graphql',
      setupRequest:(req, context)=>({
        ...req,
        headers:{
          'content-type':'application/json',
          'autohorization':'Bearer FAKE_JWT_KEY'
        },
        body:JSON.stringify(utils.qql.addTodoItem(
          context['list_id'],
          "Item title",
          false
        )),
      }),
      onResponse:(status, body, context)=>{
        if (status === 200) {
          const resp = JSON.parse(body)
          if (resp && resp['data']){
            context['todo_id'] = resp['data']['insert_todo_item_one']['id']
            created.item+=1
          } else {
            noId.item+=1
          }
        }
      }
    },{
      method: 'POST',
      path:'/v1/graphql',
      setupRequest:(req, context)=>({
        ...req,
        headers:{
          'content-type':'application/json',
          'autohorization':'Bearer FAKE_JWT_KEY'
        },
        body:JSON.stringify(utils.qql.getTodoItemForList(
          context['list_id']
        ))
      })
    },{
      method: 'POST',
      path:'/v1/graphql',
      setupRequest:(req, context)=>{
        let id=1
        if (context['todo_id']){
          id=context['todo_id']
        }
        return {
          ...req,
          headers:{
            'content-type':'application/json',
            'autohorization':'Bearer FAKE_JWT_KEY'
          },
          body:JSON.stringify(utils.qql.deleteTodoItem(id))
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