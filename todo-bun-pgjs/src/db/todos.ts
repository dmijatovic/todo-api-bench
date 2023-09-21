// initalize DB
import pgdb from './pgdb'

// NOTE! We will be catching errors
// in the api handlers (if possible)
export async function GetAllTodoLists() {
  if (!pgdb){
    throw Error("PostgreSQL client missing. Check DB connection")
  }
  const result = await pgdb`
    SELECT * FROM todo_list LIMIT 50;
  `
  return result
}

export async function GetTodoList(id:string) {
  const result=await pgdb`
    SELECT id, title 
    FROM todo_list WHERE id=${id};
  `
  return result[0]
}

export async function AddTodoList(title:string) {
  if (!title){
    return null
  }
  // SQL statement
  const result = await pgdb`
    INSERT INTO todo_list (title) 
    VALUES(${title}) RETURNING id, title;
  `
  return result[0]
}

type UpdateListProps = {
  id: string
  title: string, 
}

export async function UpdateTodoList({ id, title }: UpdateListProps) {
  // SQL statement
  const result = await pgdb`
    UPDATE todo_list SET title=${title} 
    WHERE id=${id} RETURNING id, title;
  `
  return result[0]
}

export async function DeleteTodoList(id:string) {
  const result=await pgdb`
    DELETE FROM todo_list 
    WHERE id=${id} RETURNING id, title;
  `
  return result[0]
}

export async function GetTodoItems(id: string) {
  const result=await pgdb`
    SELECT id, list_id, title, checked 
    FROM todo_item WHERE list_id=${id};
  `
  return result
}

type NewTodoItem = {
  list_id: string,
  title: string,
  checked: boolean
}
export async function AddTodoItem(todo: NewTodoItem) {
  
  const result=await pgdb`
    INSERT INTO todo_item (list_id, title, checked) 
    VALUES(${todo?.list_id},${todo?.title},${todo?.checked}) 
    RETURNING id, list_id, title, checked;
  `
  return result[0]
}

type TodoItem = NewTodoItem & {
  id: string
}
export async function UpdateTodoItem(todo: TodoItem) {  
  const result=await pgdb`UPDATE todo_item SET
    list_id=${todo?.list_id},
    title=${todo?.title},
    checked=${todo?.checked}
    WHERE id=${todo?.id}
    RETURNING id, list_id, title, checked;`

  return result[0]
}

export async function GetTodoItem(id: string) {
  const result=await pgdb`
    SELECT id, list_id, title, checked 
    FROM todo_item WHERE id=${id};
  `
  return result[0]
}

export async function DeleteTodoItem(id: string) {
  const result=await pgdb`
    DELETE FROM todo_item 
    WHERE id=${id}
    RETURNING id, list_id, title, checked;
  `
  return result[0]
}