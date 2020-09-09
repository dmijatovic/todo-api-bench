use deadpool_postgres::Client;
use std::io;
use tokio_pg_mapper::FromTokioPostgresRow;

use crate::errors::{AppError, AppErrorType};
use crate::models::{CreateTodoItem, TodoItem, TodoList};

pub async fn get_todo_lists(client: &Client) -> Result<Vec<TodoList>, AppError> {
  //get all items from todo list
  //question mark at the end optionaly returns if value is present
  let statement = client
    .prepare("select * from todo_list LIMIT 50;")
    .await
    .map_err(AppError::db_error)?;

  let todos = client
    .query(&statement, &[])
    .await
    .expect("Error getting todo list")
    .iter()
    .map(|row| TodoList::from_row_ref(row).unwrap())
    .collect::<Vec<TodoList>>();

  //return todos vector
  Ok(todos)
}

pub async fn get_list_items(client: &Client, list_id: i32) -> Result<Vec<TodoItem>, AppError> {
  // get all items from todo list
  let statement = client
    .prepare("select * from todo_item where list_id = $1 order by id;")
    .await
    .map_err(AppError::db_error)?;

  //here we pass query and variables to be added
  let items = client
    .query(&statement, &[&list_id])
    .await
    .expect("Error getting todo items")
    .iter()
    .map(|row| TodoItem::from_row_ref(row).unwrap())
    .collect::<Vec<TodoItem>>();

  //return items vector
  Ok(items)
}

pub async fn create_todo_list(client: &Client, title: String) -> Result<TodoList, AppError> {
  // get all items from todo list
  let statement = client
    .prepare("insert into todo_list (title) values($1) returning id,title;")
    .await
    .map_err(AppError::db_error)?;

  //here we pass query and variables to be added
  let res = client
    .query(&statement, &[&title])
    .await
    .map_err(AppError::db_error)?;

  res
    .iter()
    .map(|row| TodoList::from_row_ref(row).unwrap())
    .collect::<Vec<TodoList>>()
    .pop()
    .ok_or(AppError {
      message: Some("Error creating todo list".to_string()),
      cause: Some("Unknown error".to_string()),
      error_type: AppErrorType::DbError,
    })
}

pub async fn update_todo_list(client: &Client, list: &TodoList) -> Result<TodoList, AppError> {
  // get all items from todo list
  let statement = client
    .prepare("update todo_list set title=$1 where id=$2 returning id,title;")
    .await
    .map_err(AppError::db_error)?;

  // println!("{:?}", list);

  //here we pass query and variables to be added
  let res = client
    .query(&statement, &[&list.title.clone(), &list.id.clone()])
    .await
    .map_err(AppError::db_error)?;

  // println!("res: {:?}", res);

  res
    .iter()
    .map(|row| TodoList::from_row_ref(row).unwrap())
    .collect::<Vec<TodoList>>()
    .pop()
    .ok_or(AppError {
      message: Some("Error updating todo list. Check if id is valid.".to_string()),
      cause: Some("Failed to update. Invalid id?".to_string()),
      error_type: AppErrorType::DbError,
    })
}

pub async fn create_todo_item(
  client: &Client,
  todo_item: &CreateTodoItem,
) -> Result<TodoItem, AppError> {
  // get all items from todo list
  let statement = client.prepare("insert into todo_item (title,checked,list_id) values($1,$2,$3) returning id,title,checked,list_id;")
    .await
    .map_err(AppError::db_error)?;

  //here we pass query and variables to be added
  let res = client
    .query(
      &statement,
      &[
        &todo_item.item.title,
        &todo_item.item.checked,
        &todo_item.list_id,
      ],
    )
    .await
    .map_err(AppError::db_error)?;

  // return result
  res
    .iter()
    .map(|row| TodoItem::from_row_ref(row).unwrap())
    .collect::<Vec<TodoItem>>()
    .pop()
    .ok_or(AppError {
      message: Some("Error creating todo item".to_string()),
      cause: Some("Unknown error".to_string()),
      error_type: AppErrorType::DbError,
    })
}

pub async fn check_todo_item(client: &Client, list_id: i32, item_id: i32) -> Result<(), io::Error> {
  let statement = client
    .prepare(
      "update todo_item set checked = true where list_id = $1 and id = $2 and checked = false",
    )
    .await
    .unwrap();

  let result = client
    .execute(&statement, &[&list_id, &item_id])
    .await
    .expect("Error checking todo item");

  match result {
    ref updated if *updated == 1 => Ok(()),
    _ => Err(io::Error::new(
      io::ErrorKind::Other,
      "Failed to check todo item",
    )),
  }
}

pub async fn delete_todo_item(client: &Client, item_id: i32) -> Result<TodoItem, AppError> {
  let statement = client
    .prepare("delete from todo_item where id=$1 returning id,title,checked,list_id;")
    .await
    .unwrap();

  let result = client
    .query(&statement, &[&item_id])
    .await
    .expect("Error deleting todo item");

  // println!("result: {:?}", result);

  result
    .iter()
    .map(|row| TodoItem::from_row_ref(row).unwrap())
    .collect::<Vec<TodoItem>>()
    .pop()
    .ok_or(AppError {
      message: Some("Error deleting todo item. Check if id is valid.".to_string()),
      cause: Some("Failed to delete. Invalid id?".to_string()),
      error_type: AppErrorType::DbError,
    })
  // .ok_or(io::Error::new(io::ErrorKind::Other,"Failed to delete"))
}
