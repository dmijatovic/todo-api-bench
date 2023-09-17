// const autocannon = require('autocannon')
const utils = require('./utils')


function getRequests(statusByRoute,noId,created) {

  const requests = [{
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
          if (resp && resp['id']){
            context['list_id'] = resp['id']
            created.list+=1
          } else {
            noId.list+=1
          }
        }
      }
    },{
      setupRequest:(req, context)=>({
        ...req,
        method:'PUT',
        path:`/list/${context['list_id']}`,
        headers:{
          'content-type':'application/json',
          'autohorization':'Bearer FAKE_JWT_KEY'
        },
        body:JSON.stringify({
          title:"Autocannon title update"
        })
      }),
      onResponse:(status)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "PUT/list/{id}",
          statusByRoute
        )
      }
    },{
      setupRequest:(req, context)=>({
        ...req,
        method:'POST',
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
          if (resp && resp['id']){
            context['todo_id'] = resp['id']
            created.item+=1
          }else{
            noId.item+=1
          }
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
      setupRequest:(req, context)=>({
        ...req,
        method: 'GET',
        path:`/list/${context['list_id']}/todo`,
        headers:{
          'content-type':'application/json',
          'autohorization':'Bearer FAKE_JWT_KEY'
        }
      }),
      onResponse:(status)=>{
        statusByRoute = utils.writeStatusByRoute(
          status,
          "GET/list/{list_id}/todo",
          statusByRoute
        )
      }
    },{
      setupRequest:(req, context)=>({
        ...req,
        method: 'GET',
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
  }]

  return requests
}

module.exports = {
  getRequests
}