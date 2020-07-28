// third party
use serde::{Serialize, Deserialize};
use tokio_pg_mapper_derive::PostgresMapper;

#[derive(Serialize)]
pub struct Status {
  pub status:String
}

#[derive(Serialize, Deserialize, PostgresMapper, Debug)]
#[pg_mapper(table="todo_list")]
pub struct TodoList{
  pub id:i32,
  pub title: String
}

#[derive(Serialize, Deserialize, PostgresMapper)]
#[pg_mapper(table="todo_item")]
pub struct TodoItem{
  pub id: i32,
  pub title: String,
  pub checked: bool,
  pub list_id: i32
}

#[derive(Deserialize)]
pub struct CreateTodoList {
  pub title: String
}

#[derive(Deserialize)]
pub struct PostTodoItem {
  pub title: String,
  pub checked: bool
}

pub struct CreateTodoItem {
  pub item: PostTodoItem,
  pub list_id: i32
}

#[derive(Serialize)]
pub struct ApiResponse {
  pub status: u16,
  pub status_text: String
}