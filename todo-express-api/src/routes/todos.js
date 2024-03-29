const db = require('../db/todos')
const resp = require('../utils/resp')

function getAllTodoLists(req, res){
  return db.GetAllTodoLists()
    .then(data=>{
      // console.log("data received...", data)
      resp.respOK(res,data)
    })
    .catch(err=>{
      resp.respErr(res,500,err.message)
    })
}

function addTodoList(req, res){
  const todolist = req.body
  return db.AddTodoList(todolist)
    .then(data=>{
      // console.log("data received...", data)
      resp.respOK(res,data)
    })
    .catch(err=>{
      resp.respErr(res,500,err.message)
    })
}

function updateTodoList(req, res) {
  const {lid} = req.params
  const todolist = req.body
  return db.UpdateTodoList(lid,todolist)
    .then(data=>{
      // console.log("data received...", data)
      resp.respOK(res,data)
    })
    .catch(err=>{
      resp.respErr(res,500,err.message)
    })
}

function deleteTodoList(req, res){
  const {lid} = req.params
  return db.DeleteTodoList(lid)
    .then(data=>{
      // console.log("data received...", data)
      resp.respOK(res,data)
    })
    .catch(err=>{
      resp.respErr(res,500,err.message)
    })
}

function getTodoItems(req, res){
  const {lid} = req.params
  return db.GetTodoItems(lid)
    .then(data=>{
      // console.log("data received...", data)
      resp.respOK(res,data)
    })
    .catch(err=>{
      resp.respErr(res,500,err.message)
    })
}

function getTodoItem(req, res){
  const {id} = req.params
  return db.GetTodoItem(id)
    .then(data=>{
      // console.log("data received...", data)
      resp.respOK(res,data)
    })
    .catch(err=>{
      resp.respErr(res,500,err.message)
    })
}

function getTodoList(req, res){
  const {lid} = req.params
  return db.GetTodoList(lid)
    .then(data=>{
      // console.log("data received...", data)
      resp.respOK(res,data[0])
    })
    .catch(err=>{
      resp.respErr(res,500,err.message)
    })
}


function addTodoItem(req, res){
  // const {lid} = req.params
  const todo = req.body
  return db.AddTodoItem(todo)
    .then(data=>{
      // console.log("data received...", data)
      resp.respOK(res,data)
    })
    .catch(err=>{
      resp.respErr(res,500,err.message)
    })
}

function updateTodoItem(req, res) {
  const {id} = req.params
  const todo = req.body
  return db.UpdateTodoItem(id,todo)
    .then(data=>{
      // console.log("data received...", data)
      resp.respOK(res,data)
    })
    .catch(err=>{
      resp.respErr(res,500,err.message)
    })
}

function deleteTodoItem(req, res){
  const {id} = req.params
  return db.DeleteTodoItem(id)
    .then(data=>{
      // console.log("data received...", data)
      resp.respOK(res,data)
    })
    .catch(err=>{
      resp.respErr(res,500,err.message)
    })
}

module.exports={
  getAllTodoLists,
  getTodoList,
  addTodoList,
  updateTodoList,
  deleteTodoList,
  getTodoItems,
  addTodoItem,
  getTodoItem,
  updateTodoItem,
  deleteTodoItem
}