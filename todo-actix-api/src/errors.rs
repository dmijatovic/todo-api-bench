use serde::Serialize;
use actix_web::{error::ResponseError, http::StatusCode, HttpResponse};
use std::fmt;

#[derive(Debug)]
#[allow(dead_code)]
pub enum AppErrorType {
  DbError,
  NotFound
}

#[derive(Debug)]
pub struct AppError {
  pub message: Option<String>,
  pub cause: Option<String>,
  pub error_type: AppErrorType
}

impl AppError {
  pub fn message(&self) -> String {
    match &self {
      AppError{
        message: Some(message),
        cause: _,
        error_type: _
      } => message.clone(),

      AppError{
        message: None,
        cause: _,
        error_type: AppErrorType::NotFound
      } => "The requested item not found".to_string(),

      _ => "Unexpected error".to_string()
    }
  }
  pub fn db_error(err: impl ToString) -> AppError {
    AppError{
      message: Some(err.to_string()),
      cause: Some(err.to_string()),
      error_type: AppErrorType::DbError
    }
  }
}

#[derive(Serialize)]
pub struct AppErrorResponse {
  pub error: String
}

// implement formatter for AppError
impl fmt::Display for AppError {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> Result<(),fmt::Error> {
    write!(f,"{:?}", self)
  }
}

// implement actix_web response methods
// to send back custom error responses
impl ResponseError for AppError{
  fn status_code(&self) -> StatusCode{
    match self.error_type {
      AppErrorType::DbError => StatusCode::INTERNAL_SERVER_ERROR,
      AppErrorType::NotFound => StatusCode::NOT_FOUND
    }
  }

  fn error_response(&self) -> HttpResponse {
    // build response
    let mut resp = HttpResponse::build(self.status_code());
    //return resonse code and json
    resp.json(AppErrorResponse{ error: self.message() })
  }
}