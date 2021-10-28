import {IncomingMessage,ServerResponse} from 'http';
import {useBody} from 'h3'
// const pgdb = require('./pgdb')
import pgdb from './pgdb'

function sendPayload(payload:any){
  return {
    payload,
    error:undefined
  }
}

function sendError(message:string){
  return {
    payload:undefined,
    error: message
  }
}

export async function GetAllTodoLists(req:IncomingMessage,res:ServerResponse){
  if (!pgdb){
    throw Error("PostgreSQL client missing. Check DB connection")
  }
  // constuct SQL statement
  const sql=`SELECT * FROM todo_list LIMIT 50;`
  return pgdb.query(sql)
    .then( result =>{
      const {rows} = result
      return {
        payload:rows,
        error:undefined
      }
    })
    .catch(e=>{
      return sendError(e.message)
    })
}

export async function AddTodoList(req:IncomingMessage){
  const {title} = await useBody(req)
  if (!title){
    return sendError("Missing property title")
  }
  // SQL statement
  const sql=`INSERT INTO todo_list (title) VALUES($1) RETURNING id, title;`
  const values = [title]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      return sendPayload(rows[0])
    })
    .catch(e=>{
      return sendError(e.message)
    })
}

export async function UpdateTodoList(req:IncomingMessage){
  const {id,title} = await useBody(req)
  // validate
  if (!id){
    return sendError("Missing property id")
  }
  if (!title){
    return sendError("Missing property title")
  }
  // SQL statement
  const sql=`UPDATE todo_list SET title=$1 WHERE id=$2 RETURNING id, title;`
  const values = [title,id]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows.length===1){
        return sendPayload(rows[0])
      }else{
        return sendError("Not found")
      }
    })
    .catch(e=>{
      return sendError(e.message)
    })
}

export async function AddTodoItem(req:IncomingMessage){
  const {list_id,title,checked} = await useBody(req)
  if (!list_id){
    // throw Error("Missing list id property")
    return sendError("Missing property title")
  }
  if(!title){
    return sendError("Missing property title")
  }

  const sql=`INSERT INTO todo_item (list_id, title, checked) VALUES($1,$2,$3) RETURNING id, list_id, title, checked;`
  const values = [list_id,title,checked]

  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows.length===1){
        return sendPayload(rows[0])
      }else{
        return sendError("Failed to create")
      }
    })
    .catch(e=>{
      return sendError(e.message)
    })
}

export async function UpdateTodoItem(req:IncomingMessage){
  const id = req.url?.substr(1)
  const {list_id,title,checked} = await useBody(req)
  if (!id){
    // throw Error("Missing id property")
    return sendError("Missing property id")
  }
  if(!title){
    return sendError("Missing property title")
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
      if (rows.length===1){
        return sendPayload(rows[0])
      }else{
        return sendError("Failed to update")
      }
    })
    .catch(e=>{
      return sendError(e.message)
    })

}

export async function DeleteTodoItem(req:IncomingMessage){
  const id = req.url?.substr(1)
  if (!id){
    return sendError("Missing id property")
  }

  const sql=`DELETE FROM todo_item WHERE id=$1 RETURNING id, list_id, title, checked;`
  const values = [id]

  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows.length===1){
        return sendPayload(rows[0])
      }else{
        return sendError("Not found")
      }
    })
    .catch(e=>{
      return sendError(e.message)
    })
}

// NOT REQUERED FOR BECHMARK
export async function DeleteTodoList(req:IncomingMessage){
  const lid = req.url?.substr(1)
  if (!lid){
    return sendError("Missing id property")
  }
  const sql=`DELETE FROM todo_list WHERE id=$1 RETURNING id, title;`
  const values = [lid]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows.length===1){
        return sendPayload(rows[0])
      }else{
        return sendError("Not found")
      }
    })
    .catch(e=>{
      return sendError(e.message)
    })
}

// export function GetTodoList(req,res){
//   const {lid} = req.params
//   if (!lid){
//     return sendError(res,"Missing list id property")
//   }
//   const sql=`SELECT id, title FROM todo_list WHERE id=$1;`
//   const values = [lid]
//   return pgdb.query(sql,values)
//     .then( result =>{
//       const {rows} = result
//       return sendPayload(res,rows)
//     })
//     .catch(e=>{
//       return sendError(res,e.message)
//     })
// }

export async function GetTodoItems(req:IncomingMessage){
  const lid = req.url?.substr(1)
  if (!lid){
    return sendError("Missing list id property")
  }
  const sql=`SELECT id, list_id, title, checked FROM todo_item WHERE list_id=$1;`
  const values = [lid]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      return sendPayload(rows)
    })
    .catch(e=>{
      return sendError(e.message)
    })
}

export async function GetTodoItem(req:IncomingMessage){
  const id = req.url?.substr(1)
  if (!id){
    return sendError("Missing todo id property")
  }
  const sql=`SELECT id, list_id, title, checked FROM todo_item WHERE id=$1;`
  const values = [parseInt(id)]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      return sendPayload(rows)
    })
    .catch(e=>{
      return sendError(e.message)
    })
}