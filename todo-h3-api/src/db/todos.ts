// import {IncomingMessage,ServerResponse} from 'http';
// import {useBody} from 'h3'
// const pgdb = require('./pgdb')
import pgdb from './pgdb'
import { readBody, createError, EventHandlerRequest, H3Event, getRouterParams } from 'h3';

// function sendPayload(payload:any){
//   return {
//     payload,
//     error:undefined
//   }
// }

function sendError(code:number, message: string) {
  throw createError({
    statusText: message,
    status: code
  })
}

export async function GetAllTodoLists(){
  if (!pgdb){
    throw Error("PostgreSQL client missing. Check DB connection")
  }
  // constuct SQL statement
  const sql=`SELECT * FROM todo_list LIMIT 50;`
  return pgdb.query(sql)
    .then( result =>{
      const {rows} = result
      return rows
    })
    .catch(e=>{
      return sendError(500,e.message)
    })
}

export async function AddTodoList(e: H3Event) {
  // read request body
  const {title} = await readBody(e)
  if (!title){
    return sendError(400,"Missing property title")
  }
  // SQL statement
  const sql=`INSERT INTO todo_list (title) VALUES($1) RETURNING id, title;`
  const values = [title]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      return rows[0]
    })
    .catch(e=>{
      return sendError(500,e.message)
    })
}

export async function UpdateTodoList(e: H3Event){
  const { lid } = getRouterParams(e)
  const { title } = await readBody(e)
  // validate
  if (!lid || !title){
    return sendError(400,"Missing property id or title")
  }
  // SQL statement
  const sql=`UPDATE todo_list SET title=$1 WHERE id=$2 RETURNING id, title;`
  const values = [title,lid]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows.length===1){
        return rows[0]
      }else{
        return sendError(404,"Not found")
      }
    })
    .catch(e=>{
      return sendError(500,e.message)
    })
}

// NOT REQUERED FOR BECHMARK
export async function DeleteTodoList(e:H3Event){
  const { lid } = getRouterParams(e)
  if (!lid){
    return sendError(400,"Missing id property")
  }
  const sql=`DELETE FROM todo_list WHERE id=$1 RETURNING id, title;`
  const values = [lid]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      return rows[0]
    })
    .catch(e=>{
      return sendError(500,e.message)
    })
}

export function GetTodoList(e:H3Event){
  const { lid } = getRouterParams(e)
  if (!lid){
    return sendError(400,"Missing list id property")
  }
  const sql=`SELECT id, title FROM todo_list WHERE id=$1;`
  const values = [lid]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      return rows
    })
    .catch(e=>{
      return sendError(500,e.message)
    })
}

export async function GetTodoItems(e:H3Event){
  const { lid } = getRouterParams(e)
  if (!lid){
    return sendError(400,"Missing list id property")
  }
  const sql=`SELECT id, list_id, title, checked FROM todo_item WHERE list_id=$1;`
  const values = [lid]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      return rows
    })
    .catch(e=>{
      return sendError(500,e.message)
    })
}

export async function AddTodoItem(e:H3Event){
  const {list_id,title,checked} = await readBody(e)
  if (!list_id || !title){
    // throw Error("Missing list id property")
    return sendError(400,"Missing property title or list_id")
  }

  const sql=`INSERT INTO todo_item (list_id, title, checked) VALUES($1,$2,$3) RETURNING id, list_id, title, checked;`
  const values = [list_id,title,checked]

  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      return rows[0]
    })
    .catch(e=>{
      return sendError(500,e.message)
    })
}

export async function UpdateTodoItem(e:H3Event){
  const { id } = getRouterParams(e)
  const {list_id,title,checked} = await readBody(e)
  if (!id||!list_id||!title){
    // throw Error("Missing id property")
    return sendError(400,"Missing property id,list_id or title")
  }

  const sql=`UPDATE todo_item SET
    list_id=$1,
    title=$2,
    checked=$3
    WHERE id=$4
    RETURNING id, list_id, title, checked;`
  const values = [list_id,title,checked,parseInt(id)]

  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      return rows[0]
    })
    .catch(e=>{
      return sendError(500,e.message)
    })

}

export async function GetTodoItem(e:H3Event){
  const { id } = getRouterParams(e)
  if (!id){
    return sendError(400,"Missing todo id property")
  }
  const sql=`SELECT id, list_id, title, checked FROM todo_item WHERE id=$1;`
  const values = [parseInt(id)]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      return rows[0]
    })
    .catch(e=>{
      return sendError(500,e.message)
    })
}

export async function DeleteTodoItem(e:H3Event){
  const { id } = getRouterParams(e)
  if (!id) {
    return sendError(400, "Missing todo id property")
  }

  const sql=`DELETE FROM todo_item WHERE id=$1 RETURNING id, list_id, title, checked;`
  const values = [id]

  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      return rows[0]
    })
    .catch(e=>{
      return sendError(500,e.message)
    })
}