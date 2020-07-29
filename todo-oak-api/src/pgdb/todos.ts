import {runQuery} from "./pgdb.ts"
import {QueryResult, QueryConfig} from "../../deps.ts"

export interface BaseTodoList{
  title: string
}

export interface TodoList extends BaseTodoList{
  id: number
}

export interface PgDbResults {
  rows: any[],
  cols: any[],
  rowCount: number
}

export interface BaseTodoItem{
  list_id: number,
  title:string,
  checked: boolean,
}

export interface TodoItem extends BaseTodoItem{
  id: number,
}

export function GetAllTodoLists():Promise<PgDbResults>{
  const sql=`SELECT id, title FROM todo_list;`
  return runQuery(sql)
    .then((result:QueryResult) =>{
      // console.log(result)
      return {
        cols: result.rowDescription.columns,
        rows: result.rows,
        rowCount: result.rowCount || 0
      }
    })
    //beter to catch errors in route fn
}

export function AddTodoList(tl:BaseTodoList):Promise<TodoList>{
  const sql:QueryConfig = {
    text:`INSERT INTO todo_list (title) VALUES($1) RETURNING id, title;`,
    args:[tl.title]
  }
  return runQuery(sql)
    .then((result:QueryResult) =>{
      // console.log(rows)
      const todo:TodoList = {
        id: result.rows[0][0],
        title: result.rows[0][1],
      }
      return todo
    })
    //beter to catch errors in route fn
}

export function UpdateTodoList(tl:TodoList):Promise<TodoList>{
  const sql:QueryConfig = {
    text:`UPDATE todo_list SET title=$1 WHERE id=$2 RETURNING id, title;`,
    args:[tl.title, tl.id]
  }
  return runQuery(sql)
    .then((result:QueryResult) =>{
      // console.log(rows)
      const todo:TodoList = {
        id: result.rows[0][0],
        title: result.rows[0][1],
      }
      return todo
    })
    //beter to catch errors in route fn
}

export function DeleteTodoList(lid:number):Promise<TodoList>{
  const sql:QueryConfig = {
    text:`DELETE FROM todo_list WHERE id=$1 RETURNING id, title;`,
    args:[lid]
  }
  return runQuery(sql)
    .then((result:QueryResult) =>{
      // console.log(rows)
      const todo:TodoList = {
        id: result.rows[0][0],
        title: result.rows[0][1],
      }
      return todo
    })
    //beter to catch errors in route fn
}

export function GetTodoItems(lid:number):Promise<PgDbResults>{
  const sql:QueryConfig={
    text:`SELECT id,list_id,title,checked FROM todo_item WHERE list_id=$1;`,
    args:[lid]
  }
  return runQuery(sql)
    .then((result:QueryResult) =>{
      // console.log(result)
      return {
        cols: result.rowDescription.columns,
        rows: result.rows,
        rowCount: result.rowCount || 0,
      }
    })
    //beter to catch errors in route fn
}

export function AddTodoItem(ti:BaseTodoItem):Promise<TodoItem>{
  const sql:QueryConfig = {
    text:`INSERT INTO todo_item (list_id,title,checked) VALUES($1,$2,$3) RETURNING id, list_id, title, checked;`,
    args:[ti.list_id,ti.title,ti.checked]
  }
  return runQuery(sql)
    .then((result:QueryResult) =>{
      // console.log(rows)
      const todo:TodoItem = {
        id: result.rows[0][0],
        list_id: result.rows[0][1],
        title: result.rows[0][2],
        checked: result.rows[0][3]
      }
      return todo
    })
    //beter to catch errors in route fn
}

export function UpdateTodoItem(ti:TodoItem):Promise<TodoItem>{
  const sql:QueryConfig = {
    text:`UPDATE todo_item SET
      list_id=$1,
      title=$2,
      checked=$3
    WHERE id=$4
    RETURNING id, list_id, title, checked;`,
    args:[ti.list_id,ti.title,ti.checked, ti.id]
  }
  return runQuery(sql)
    .then((result:QueryResult) =>{
      // console.log(rows)
      const todo:TodoItem = {
        id: result.rows[0][0],
        list_id: result.rows[0][1],
        title: result.rows[0][2],
        checked: result.rows[0][3]
      }
      return todo
    })
    //beter to catch errors in route fn
}

export function DeleteTodoItem(id:number):Promise<TodoItem>{
  const sql:QueryConfig = {
    text:`DELETE FROM todo_item WHERE id=$1 RETURNING id, list_id, title, checked;`,
    args:[id]
  }
  return runQuery(sql)
    .then((result:QueryResult) =>{
      const todo:TodoItem = {
        id: result.rows[0][0],
        list_id: result.rows[0][1],
        title: result.rows[0][2],
        checked: result.rows[0][3]
      }
      return todo
    })
    //beter to catch errors in route fn
}