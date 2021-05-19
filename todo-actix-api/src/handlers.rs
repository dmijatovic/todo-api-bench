use actix_web::{delete, get, post, put};
use actix_web::{web, HttpResponse, Responder};
use deadpool_postgres::{Client, Pool};
use std::io::ErrorKind::Other;

use crate::db;
use crate::errors::AppError;
use crate::models::{ApiResponse, CreateTodoList, PostTodoItem, Status, TodoList};

// home returns json as string
// no return needed
#[get("/")]
pub async fn home() -> impl Responder {
  // "{\"status\":\"202\"}"
  web::HttpResponse::Ok().json(Status {
    status: "OK".to_string(),
  })
}

// create todo list
#[post("/list")]
pub async fn create_todo_list(
  db_pool: web::Data<Pool>,
  json: web::Json<CreateTodoList>,
) -> Result<impl Responder, AppError> {
  let client: Client = db_pool.get().await.map_err(AppError::db_error)?;

  let result = db::create_todo_list(&client, json.title.clone()).await;

  // return response
  result.map(|todos| HttpResponse::Ok().json(todos))
}

// update todo list
#[put("/list")]
pub async fn update_todo_list(
  db_pool: web::Data<Pool>,
  json: web::Json<TodoList>,
) -> Result<impl Responder, AppError> {
  let client: Client = db_pool.get().await.map_err(AppError::db_error)?;

  let result = db::update_todo_list(&client, &json).await;

  result.map(|todos| HttpResponse::Ok().json(todos))
}

// get todo lists
#[get("/list")]
pub async fn get_todo_lists(db_pool: web::Data<Pool>) -> Result<impl Responder, AppError> {
  // connect to db
  let client: Client = db_pool.get().await.map_err(AppError::db_error)?;

  // make query
  let result = db::get_todo_lists(&client).await;
  // return response
  result.map(|todos| HttpResponse::Ok().json(todos))
}

// get specific list
#[get("/list/{list_id}")]
pub async fn get_todo_list(
  db_pool: web::Data<Pool>,
  id: web::Path<i32>,
) -> Result<impl Responder, AppError> {
  // connect to db
  let client: Client = db_pool.get().await.map_err(AppError::db_error)?;
  // make query
  let result = db::get_todo_list(&client, id.clone()).await;
  // return response
  result.map(|todos| HttpResponse::Ok().json(todos))
}

// get all todo items for list id
#[get("/todo/list/{list_id}")]
pub async fn get_list_items(
  db_pool: web::Data<Pool>,
  id: web::Path<i32>,
) -> Result<impl Responder, AppError> {
  let client: Client = db_pool.get().await.map_err(AppError::db_error)?;

  let result = db::get_list_items(&client, id.clone()).await;

  // return response
  result.map(|items| HttpResponse::Ok().json(items))
}

#[put("/todo/{id}")]
pub async fn update_todo_item(
  db_pool: web::Data<Pool>,
  path: web::Path<(i32,)>,
  json: web::Json<PostTodoItem>,
) -> impl Responder {
  let client: Client = db_pool
    .get()
    .await
    .expect("Error connecting to the database");

  let todo_item = PostTodoItem {
    title: json.title.clone(),
    checked: json.checked.clone(),
    list_id: json.list_id.clone(),
  };

  let result = db::update_todo_item(&client, &todo_item, path.0).await;

  let ok_resp = ApiResponse {
    status: 200,
    status_text: String::from("OK"),
  };

  match result {
    Ok(()) => HttpResponse::Ok().json(&ok_resp),
    Err(ref e) if e.kind() == Other => HttpResponse::Ok().json(ApiResponse {
      status: 200,
      status_text: String::from("Already checked:"),
    }),
    Err(_) => HttpResponse::InternalServerError().into(),
  }
}

#[delete("/todo/{id}")]
pub async fn delete_todo_item(db_pool: web::Data<Pool>, id: web::Path<i32>) -> impl Responder {
  // let resp = String::from(format!("Test this back {}",path));
  let client: Client = db_pool
    .get()
    .await
    .expect("Error connecting to the database");

  let result = db::delete_todo_item(&client, id.clone()).await;

  result.map(|todos| HttpResponse::Ok().json(todos))
}

#[get("/todo/{id}")]
pub async fn get_todo_item(db_pool: web::Data<Pool>, id: web::Path<i32>) -> impl Responder {
  // let resp = String::from(format!("Test this back {}",path));
  let client: Client = db_pool
    .get()
    .await
    .expect("Error connecting to the database");

  let result = db::get_todo_item(&client, id.clone()).await;

  result.map(|todos| HttpResponse::Ok().json(todos))
}

#[post("/todo")]
pub async fn create_todo_item(
  db_pool: web::Data<Pool>,
  json: web::Json<PostTodoItem>,
) -> Result<impl Responder, AppError> {
  let client: Client = db_pool.get().await.map_err(AppError::db_error)?;

  let todo_item = PostTodoItem {
    title: json.title.clone(),
    checked: json.checked.clone(),
    list_id: json.list_id.clone(),
  };

  let result = db::create_todo_item(&client, &todo_item).await;
  // return response
  result.map(|item| HttpResponse::Ok().json(item))
}
