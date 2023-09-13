// initalize DB
import pgdb from './pgdb'

// NOTE! We will be catching errors
// in the api handlers (if possible)
export async function GetAllTodoLists() {
  // constuct SQL statement
  const sql = `SELECT * FROM todo_list LIMIT 50;`
  // pass it to DB
  const {rows} = await pgdb.query(sql)
  // return result
  return rows
}

export async function GetTodoList(id:string) {
  // constuct SQL statement
  const sql = `SELECT id, title FROM todo_list WHERE id=$1 ;`
  const values = [id]
  // pass it to DB
  const { rows } = await pgdb.query(sql,values)
  // return result
  if (rows) {
    return rows[0]
  }
  return null
}

export async function AddTodoList(title:string) {
  // constuct SQL statement
  const sql = `INSERT INTO todo_list (title) VALUES($1) RETURNING id, title;`
  const values = [title]
  // pass it to DB
  const { rows } = await pgdb.query(sql,values)
  // return result
  if (rows) {
    return rows[0]
  }
  // return nothing
  return null
}

type UpdateListProps = {
  id: string
  title: string, 
}

export async function UpdateTodoList({ id, title }: UpdateListProps) {
  // constuct SQL statement
  const sql = `UPDATE todo_list SET title=$1 WHERE id=$2 RETURNING id, title;`
  const values = [title,id]

  // pass it to DB
  const { rows } = await pgdb.query(sql, values)
  // return result
  if (rows) {
    return rows[0]
  }
  // return nothing
  return null
}

export async function DeleteTodoList(id:string) {
  // constuct SQL statement
  const sql = `DELETE FROM todo_list WHERE id=$1 RETURNING id, title;`
  const values = [id]
  // pass it to DB
  const { rows } = await pgdb.query(sql, values)
  // return result
  if (rows) {
    return rows[0]
  }
  // return nothing
  return null
}

export async function GetTodoItems(id: string) {
  // constuct SQL statement
  const sql = `SELECT id, list_id, title, checked FROM todo_item WHERE list_id=$1;`
  const values = [id]
  // pass it to DB
  const { rows } = await pgdb.query(sql, values)
  // return result
  if (rows) {
    return rows
  }
  // return nothing
  return null
}

type NewTodoItem = {
  list_id: string,
  title: string,
  checked: boolean
}
export async function AddTodoItem(todo: NewTodoItem) {
  // constuct SQL statement
  const sql = `INSERT INTO todo_item (list_id, title, checked) VALUES($1,$2,$3) RETURNING id, list_id, title, checked;`
  const values = [todo['list_id'], todo['title'], todo['checked']]

  // pass it to DB
  const { rows } = await pgdb.query(sql, values)
  // return result
  if (rows) {
    return rows[0]
  }
  // return nothing
  return null
}

type TodoItem = NewTodoItem & {
  id: string
}
export async function UpdateTodoItem(todo: TodoItem) {
  // constuct SQL statement
  const sql = `UPDATE todo_item SET
    list_id=$1,
    title=$2,
    checked=$3
    WHERE id=$4
    RETURNING id, list_id, title, checked;`
  const values = [todo['list_id'], todo['title'], todo['checked'], todo['id']]

  // pass it to DB
  const { rows } = await pgdb.query(sql, values)
  // return result
  if (rows) {
    return rows[0]
  }
  // return nothing
  return null
}

export async function GetTodoItem(id: string) {
  // constuct SQL statement
  const sql = `SELECT id, list_id, title, checked FROM todo_item WHERE id=$1 ;`
  const values = [id]
  // pass it to DB
  const { rows } = await pgdb.query(sql, values)
  // return result
  if (rows) {
    return rows
  }
  // return nothing
  return null
}

export async function DeleteTodoItem(id: string) {
  // constuct SQL statement
  const sql = `DELETE FROM todo_item WHERE id=$1 RETURNING id, list_id, title, checked;`
  const values = [id]
  // pass it to DB
  const { rows } = await pgdb.query(sql, values)
  // return result
  if (rows) {
    return rows[0]
  }
  // return nothing
  return null
}