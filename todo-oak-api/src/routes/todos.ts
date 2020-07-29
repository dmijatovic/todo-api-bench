
import {Request, Response} from "../../deps.ts"
import {respOK, respErr} from "../utils/response.ts"
import * as db from "../pgdb/todos.ts"

export async function getAllTodoLists({response:res}:{response:Response}){
  // get all todo from db
  return db.GetAllTodoLists()
    .then(data=>{
      // return reponse
      res.body = respOK(data)
      // write status
      res.status = 200
    })
    .catch(err=>{
      res.body = respErr(500,err.message)
      res.status = 500
    })
}

// destructure request and response from Context and rename to req and res
export async function addTodoList({request:req, response:res}:{request:Request, response:Response}){
  const body = await req.body()
  // console.log("body", body)

  res.headers.set("Content-Type","application/json")
  if (body.type!="json"){
    res.body = respErr(400,"JSON body expected")
    res.status = 400
  }else{
    return db.AddTodoList(body.value)
      .then(todolist=>{
        res.body = respOK(todolist)
        res.status=200
      })
      .catch(err=>{
        res.body = respErr(500,err.message)
        res.status = 500
      })
  }
}

export async function updateTodoList({request:req, response:res}:{request:Request, response:Response}){
  const body = await req.body()

  res.headers.set("Content-Type","application/json")
  if (body.type!="json"){
    res.body = respErr(400,"JSON body expected")
    res.status = 400
  }else{
    return db.UpdateTodoList(body.value)
      .then(todolist=>{
        res.body = respOK(todolist)
        res.status=200
      })
      .catch(err=>{
        res.body = respErr(500,err.message)
        res.status = 500
      })
  }
}

export function deleteTodoList({params, response:res}:{params:any, response:Response}){
  const lid = parseInt(params['id'])
  if (lid > 0){
    return db.DeleteTodoList(lid)
      .then(todolist=>{
        res.body = respOK(todolist)
      })
      .catch(err=>{
        res.body = respErr(500,err.message)
        res.status = 500
      })
  }else{
    res.body = respErr(400,"List id not positive number. Check parameter")
    res.status = 400
  }
}

export function getTodoItems({params, response:res}:{params:any, response:Response}){
  const lid = parseInt(params['lid'])
  return db.GetTodoItems(lid)
    .then(data=>{
      res.body = respOK(data)
    })
    .catch(err=>{
      res.body = respErr(500,err.message)
      res.status = 500
    })
}

export async function addTodoItem({request:req, response:res, params}:{request:Request, response:Response, params:any}){
  const body = await req.body()

  res.headers.set("Content-Type","application/json")
  if (body.type!="json"){
    res.body = respErr(400,"JSON body expected")
    res.status = 400
  }else{
    const newItem = {
      ...body.value,
      list_id: params['lid'],
    }
    return db.AddTodoItem(newItem)
      .then(todo=>{
        res.body = respOK(todo)
      })
      .catch(err=>{
        res.body = respErr(500,err.message)
        res.status = 500
      })
  }
}

export async function updateTodoItem({request:req, response:res}:{request:Request, response:Response}){
  const body = await req.body()

  res.headers.set("Content-Type","application/json")
  if (body.type!="json"){
    res.body = respErr(400,"JSON body expected")
    res.status = 400
  }else{
    return db.UpdateTodoItem(body.value)
      .then(todo=>{
        res.body = respOK(todo)
      })
      .catch(err=>{
        res.body = respErr(500,err.message)
        res.status = 500
      })
  }
}

export function deleteTodoItem({params, response:res}:{params:any, response:Response}){
  const id = parseInt(params['id'])
  if (id > 0){
    return db.DeleteTodoItem(id)
      .then(todo=>{
        res.body = respOK(todo)
      })
      .catch(err=>{
        res.body = respErr(500,err.message)
        res.status = 500
      })
  }else{
    res.body = respErr(400,"Item id not positive number. Check parameter.")
    res.status = 400
  }
}
