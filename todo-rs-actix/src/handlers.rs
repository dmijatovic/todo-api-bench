use actix_web::{get, post, put};
use actix_web::{Responder, web, HttpResponse};
use deadpool_postgres::{Pool, Client};
use std::io::ErrorKind::Other;

use crate::models::{Status,CreateTodoList,PostTodoItem, CreateTodoItem,ApiResponse};
use crate::db;
use crate::errors::{AppError};


// home returns json as string
// no return needed
#[get("/")]
pub async fn home()->impl Responder{
  // "{\"status\":\"202\"}"
  web::HttpResponse::Ok().json(Status {status: "OK".to_string() })
}


// get todos route
#[get("/todos")]
pub async fn get_todo_lists(db_pool: web::Data<Pool>) -> Result<impl Responder, AppError> {
  // connect to db
  let client: Client = db_pool.get()
    .await
    .map_err(AppError::db_error)?;

  // make query
  let result = db::get_todo_lists(&client).await;
  // return response
  result.map(|todos| HttpResponse::Ok().json(todos))
}

// create todo list
#[post("/todos")]
pub async fn create_todo_list(db_pool: web::Data<Pool>, json: web::Json<CreateTodoList>) -> Result<impl Responder, AppError> {

  let client: Client = db_pool.get()
    .await
    .map_err(AppError::db_error)?;

  let result = db::create_todo_list(&client, json.title.clone()).await;

  // return response
  result.map(|todos| HttpResponse::Ok().json(todos))
  // match result {
  //   Ok(todos) => HttpResponse::Ok().json(todos),
  //   Err(_) => HttpResponse::InternalServerError().into()
  // }
}


// get todo items from the list
#[get("/todos/{list_id}/items")]
pub async fn get_list_items(db_pool: web::Data<Pool>, path: web::Path<(i32,)>) -> Result<impl Responder, AppError> {

  let client: Client = db_pool.get()
    .await
    .map_err(AppError::db_error)?;

  let result = db::get_list_items(&client, path.0).await;

  // return response
  result.map(|items| HttpResponse::Ok().json(items))

  // match result {
  //   Ok(items) => HttpResponse::Ok().json(items),
  //   Err(_) => HttpResponse::InternalServerError().into()
  // }
}

#[post("/todos/{list_id}/items")]
pub async fn create_todo_item(db_pool: web::Data<Pool>, path: web::Path<(i32,)>,json: web::Json<PostTodoItem>) -> Result<impl Responder, AppError> {

  let client: Client = db_pool.get()
    .await
    .map_err(AppError::db_error)?;

  let todo_item = CreateTodoItem{
    item: PostTodoItem{
      title: json.title.clone(),
      checked: json.checked.clone()
    },
    list_id: path.0
  };

  let result = db::create_todo_item(&client, &todo_item).await;
  // return response
  result.map(|item| HttpResponse::Ok().json(item))
  // match result {
  //   Ok(items) => HttpResponse::Ok().json(items),
  //   Err(_) => HttpResponse::InternalServerError().into()
  // }
}

#[put("/todos/{list_id}/items/{item_id}")]
pub async fn check_todo_item(db_pool: web::Data<Pool>, path: web::Path<(u32,u32)>) -> impl Responder {

  let client: Client = db_pool.get().await
    .expect("Error connecting to the database");

  let result = db::check_todo_item(&client, path.0, path.1).await;

  let ok_resp = ApiResponse{
    status:200,
    status_text: String::from("OK")
  };

  match result {
    Ok(()) => HttpResponse::Ok().json(&ok_resp),
    Err(ref e) if e.kind() == Other => HttpResponse::Ok().json(ApiResponse{status:200,status_text: String::from("Already checked:")}),
    Err(_) => HttpResponse::InternalServerError().into()
  }
}