
const pgdb = require('./pgdb')

function sendPayload(res,payload){
  return res.status(200).send(payload)
}

function sendError(res,message){
  return res.status(400).send({
    payload:undefined,
    error: message
  })
}

function GetAllTodoLists(req,res){
  if (!pgdb){
    throw Error("PostgreSQL client missing. Check DB connection")
  }
  // constuct SQL statement
  const sql=`SELECT * FROM todo_list LIMIT 50;`
  return pgdb.query(sql)
    .then( result =>{
      const {rows} = result
      return sendPayload(res,rows)
    })
    .catch(e=>{
      return sendError(res,e.message)
    })
}

function AddTodoList(req,res){
  const {title} = req.body
  if (!title){
    return sendError(res,"Missing property title")
  }
  // SQL statement
  const sql=`INSERT INTO todo_list (title) VALUES($1) RETURNING id, title;`
  const values = [title]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      return sendPayload(res,rows[0])
    })
    .catch(e=>{
      return sendError(res,e.message)
    })
}

function UpdateTodoList(req, res) {
  const {lid} = req.params
  const {title} = req.body
  // validate
  if (!lid){
    return sendError(res,"Missing property id")
  }
  if (!title){
    return sendError(res,"Missing property title")
  }
  // SQL statement
  const sql=`UPDATE todo_list SET title=$1 WHERE id=$2 RETURNING id, title;`
  const values = [title,lid]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows.length===1){
        return sendPayload(res,rows[0])
      }else{
        return sendError(res,"Not found")
      }
    })
    .catch(e=>{
      return sendError(res,e.message)
    })
}

// NOT REQUERED FOR BECHMARK
function DeleteTodoList(req,res){
  const {lid} = req.params
  if (!lid){
    return sendError(res,"Missing id property")
  }
  const sql=`DELETE FROM todo_list WHERE id=$1 RETURNING id, title;`
  const values = [lid]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows.length===1){
        return sendPayload(res,rows[0])
      }else{
        return sendError(res,"Not found")
      }
    })
    .catch(e=>{
      return sendError(res,e.message)
    })
}

function AddTodoItem(req,res){
  const {list_id,title,checked} = req.body
  if (!list_id){
    // throw Error("Missing list id property")
    return sendError(res,"Missing property title")
  }
  if(!title){
    return sendError(res,"Missing property title")
  }

  const sql=`INSERT INTO todo_item (list_id, title, checked) VALUES($1,$2,$3) RETURNING id, list_id, title, checked;`
  const values = [list_id,title,checked]

  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows.length===1){
        return sendPayload(res,rows[0])
      }else{
        return sendError(res,"Failed to create")
      }
    })
    .catch(e=>{
      return sendError(res,e.message)
    })
}

function UpdateTodoItem(req,res){
  const {id} = req.params
  const {list_id,title,checked} = req.body
  if (!id){
    // throw Error("Missing id property")
    return sendError(res,"Missing property id")
  }
  if(!title){
    return sendError(res,"Missing property title")
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
        return sendPayload(res,rows[0])
      }else{
        return sendError(res,"Failed to update")
      }
    })
    .catch(e=>{
      return sendError(res,e.message)
    })

}

function DeleteTodoItem(req,res){
  const {id} = req.params
  if (!id){
    return sendError(res,"Missing id property")
  }

  const sql=`DELETE FROM todo_item WHERE id=$1 RETURNING id, list_id, title, checked;`
  const values = [id]

  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows.length===1){
        return sendPayload(res,rows[0])
      }else{
        return sendError(res,"Not found")
      }
    })
    .catch(e=>{
      return sendError(res,e.message)
    })
}

function GetTodoList(req,res){
  const {lid} = req.params
  if (!lid){
    return sendError(res,"Missing list id property")
  }
  const sql=`SELECT id, title FROM todo_list WHERE id=$1;`
  const values = [lid]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      return sendPayload(res,rows)
    })
    .catch(e=>{
      return sendError(res,e.message)
    })
}

function GetTodoItems(req,res){
  const {lid} = req.params
  if (!lid){
    return sendError(res,"Missing list id property")
  }
  const sql=`SELECT id, list_id, title, checked FROM todo_item WHERE list_id=$1;`
  const values = [lid]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      return sendPayload(res,rows)
    })
    .catch(e=>{
      return sendError(res,e.message)
    })
}

function GetTodoItem(req,res){
  const {id} = req.params
  if (!id){
    return sendError(res,"Missing todo id property")
  }
  const sql=`SELECT id, list_id, title, checked FROM todo_item WHERE id=$1;`
  const values = [parseInt(id)]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      return sendPayload(res,rows)
    })
    .catch(e=>{
      return sendError(res,e.message)
    })
}


module.exports={
  GetAllTodoLists,
  GetTodoList,
  AddTodoList,
  UpdateTodoList,
  DeleteTodoList,
  GetTodoItems,
  GetTodoItem,
  AddTodoItem,
  UpdateTodoItem,
  DeleteTodoItem
}