
const pgdb = require('./pgdb')

// const client = getClient()
function GetAllTodoLists(){
  if (!pgdb){
    throw Error("PostgreSQL client missing. Check DB connection")
  }
  // constuct SQL statement
  const sql=`SELECT * FROM todo_list LIMIT 50;`
  return pgdb.query(sql)
    .then( result =>{
      const {rows} = result
      if (rows){
        return rows
      } else {
        return null
      }
    })
    // better to catch error in other function
}

function GetTodoItem(id=0){
  if (id===0){
    throw Error("Missing list id property")
  }
  const sql=`SELECT id, list_id, title, checked FROM todo_item WHERE id=$1 ;`
  const values = [id]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows){
        return rows
      } else {
        return null
      }
    })
}

function GetTodoList(lid=0){
  if (lid===0){
    throw Error("Missing list id property")
  }
  const sql=`SELECT id, title FROM todo_list WHERE id=$1 ;`
  const values = [lid]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows){
        return rows
      } else {
        return null
      }
    })
}

function AddTodoList(todolist){
  if (!todolist['title']){
    throw Error("Missing property title")
  }
  // console.log("todolist:", todolist)
  // constuct SQL statement
  const sql=`INSERT INTO todo_list (title) VALUES($1) RETURNING id, title;`
  const values = [todolist['title']]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows){
        return rows[0]
      } else {
        return null
      }
    })
    // better to catch error in other function
}

function UpdateTodoList(todolist){
  if (!todolist['title']){
    throw Error("Missing property title")
  }
  // console.log("todolist:", todolist)
  // constuct SQL statement
  const sql=`UPDATE todo_list SET title=$1 WHERE id=$2 RETURNING id, title;`
  const values = [todolist['title'],todolist['id']]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows){
        return rows[0]
      } else {
        return null
      }
    })
}

function DeleteTodoList(id=0){
  if (id===0){
    throw Error("Missing id property")
  }
  const sql=`DELETE FROM todo_list WHERE id=$1 RETURNING id, title;`
  const values = [id]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows){
        return rows[0]
      } else {
        return null
      }
    })
}

function GetTodoItems(lid=0){
  if (lid===0){
    throw Error("Missing list id property")
  }
  const sql=`SELECT id, list_id, title, checked FROM todo_item WHERE list_id=$1;`
  const values = [lid]
  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows){
        return rows
      } else {
        return null
      }
    })
}

function AddTodoItem(todo){
  
  const sql=`INSERT INTO todo_item (list_id, title, checked) VALUES($1,$2,$3) RETURNING id, list_id, title, checked;`
  const values = [todo['list_id'],todo['title'],todo['checked']]

  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows){
        return rows[0]
      } else {
        return null
      }
    })
    // better to catch error in other function
}

function UpdateTodoItem(todo){
  if (!todo['title']){
    throw Error("Missing title property")
  }

  const sql=`UPDATE todo_item SET
    list_id=$1,
    title=$2,
    checked=$3
    WHERE id=$4
    RETURNING id, list_id, title, checked;`
  const values = [todo['list_id'],todo['title'],todo['checked'],todo['id']]

  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows){
        return rows[0]
      } else {
        return null
      }
    })

}

function DeleteTodoItem(id=0){
  if (id===0){
    throw Error("Missing list id property")
  }

  const sql=`DELETE FROM todo_item WHERE id=$1 RETURNING id, list_id, title, checked;`
  const values = [id]

  return pgdb.query(sql,values)
    .then( result =>{
      const {rows} = result
      if (rows){
        return rows[0]
      } else {
        return null
      }
    })
    // better to catch error in other function
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