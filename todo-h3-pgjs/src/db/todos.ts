// import {IncomingMessage,ServerResponse} from 'http';
// import {useBody} from 'h3'
// const pgdb = require('./pgdb')
import pgdb from './pgdb'
import { 
  readBody, createError, 
  H3Event, getRouterParams 
} from 'h3';

function sendError(code:number, message: string) {
  throw createError({
    statusText: message,
    status: code
  })
}

export async function GetAllTodoLists(){
  try{
    if (!pgdb){
      throw Error("PostgreSQL client missing. Check DB connection")
    }
    const result = await pgdb`
      SELECT * FROM todo_list LIMIT 50;
    `
    return result
  }catch(e:any){
    return sendError(500,e.message)
  }
}

export async function AddTodoList(e: H3Event) {
  try{
    // read request body
    const {title} = await readBody(e)
    if (!title){
      return sendError(400,"Missing property title")
    }
    // SQL statement
    const result = await pgdb`
      INSERT INTO todo_list (title) 
      VALUES(${title}) RETURNING id, title;
    `
    return result[0]
  }catch(e:any){
    return sendError(500,e.message)
  }
}

export async function UpdateTodoList(e: H3Event){
  try{
    const { lid } = getRouterParams(e)
    const { title } = await readBody(e)
    // validate
    if (!lid || !title){
      return sendError(400,"Missing property id or title")
    }
    // SQL statement
    const result = await pgdb`
      UPDATE todo_list SET title=${title} 
      WHERE id=${lid} RETURNING id, title;
    `
    return result[0]
  }catch(e:any){
    return sendError(500,e.message)
  }
}

// NOT REQUERED FOR BECHMARK
export async function DeleteTodoList(e:H3Event){
  try{
    const { lid } = getRouterParams(e)
    if (!lid){
      return sendError(400,"Missing id property")
    }
    const result=await pgdb`
      DELETE FROM todo_list 
      WHERE id=${lid} RETURNING id, title;
    `
    return result[0]
  }catch(e:any){
    return sendError(500,e.message)
  }
}

export async function GetTodoList(e:H3Event){
  try{
    const { lid } = getRouterParams(e)
    if (!lid){
      return sendError(400,"Missing list id property")
    }
    const result=await pgdb`
      SELECT id, title 
      FROM todo_list WHERE id=${lid};
    `
    return result[0]
  }catch(e:any){
    return sendError(500,e.message)
  }
}

export async function GetTodoItems(e:H3Event){
  try{
    const { lid } = getRouterParams(e)
    if (!lid){
      return sendError(400,"Missing list id property")
    }
    const result=await pgdb`
      SELECT id, list_id, title, checked 
      FROM todo_item WHERE list_id=${lid};
    `
    return result
  }catch(e:any){
    return sendError(500,e.message)
  }
}

export async function AddTodoItem(e:H3Event){
  try{
    const {list_id,title,checked} = await readBody(e)
    if (!list_id || !title){
      // throw Error("Missing list id property")
      return sendError(400,"Missing property title or list_id")
    }
  
    const result=await pgdb`
      INSERT INTO todo_item (list_id, title, checked) 
      VALUES(${list_id},${title},${checked}) 
      RETURNING id, list_id, title, checked;
    `
    return result[0]
  }catch(e:any){
    return sendError(500,e.message)
  }
}

export async function UpdateTodoItem(e:H3Event){
  try{
    const { id } = getRouterParams(e)
    const {list_id,title,checked} = await readBody(e)
    if (!id||!list_id||!title){
      // throw Error("Missing id property")
      return sendError(400,"Missing property id,list_id or title")
    }
  
    const result=await pgdb`UPDATE todo_item SET
      list_id=${list_id},
      title=${title},
      checked=${checked}
      WHERE id=${id}
      RETURNING id, list_id, title, checked;`

    return result[0]
  }catch(e:any){
    return sendError(500,e.message)
  }
}

export async function GetTodoItem(e:H3Event){
  try{
    const { id } = getRouterParams(e)
    if (!id){
      return sendError(400,"Missing todo id property")
    }
    const result=await pgdb`
      SELECT id, list_id, title, checked 
      FROM todo_item WHERE id=${id};
    `
    return result[0]
  }catch(e:any){
    return sendError(500,e.message)
  }
}

export async function DeleteTodoItem(e:H3Event){
  try{
    const { id } = getRouterParams(e)
    if (!id) {
      return sendError(400, "Missing todo id property")
    }
    const result=await pgdb`
      DELETE FROM todo_item 
      WHERE id=${id}
      RETURNING id, list_id, title, checked;
    `
    return result[0]
  }catch(e:any){
    return sendError(500,e.message)
  }
}