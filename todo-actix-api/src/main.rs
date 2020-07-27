// system
use std::io;
// third party
use actix_web::{HttpServer, App};
use actix_web::middleware::Logger;

// local modules
mod config;
mod models;
mod handlers;
mod db;
mod errors;

use dotenv::dotenv;
use tokio_postgres::NoTls;
// use crate::handlers::*;

#[actix_rt::main]
async fn main() -> io::Result<()>{
  // load env variables
  dotenv().ok();
  let config = crate::config::Config::from_env().unwrap();

  // create pg connection pool
  let pool = config.pg.create_pool(NoTls).unwrap();

  //logger
  std::env::set_var("RUST_LOG", "actix_web=debug");
  env_logger::init();

  //start server
  println!("Starting server on http://{}:{}",config.server.host,config.server.port);

  HttpServer::new(move || {
    App::new()
      .wrap(Logger::new("%r - %s [%b bytes %D ms] %{User-Agent}i"))
      .data(pool.clone())
      .service(handlers::home)
      .service(handlers::create_todo_list)
      .service(handlers::get_todo_lists)
      .service(handlers::get_list_items)
      .service(handlers::create_todo_item)
      .service(handlers::check_todo_item)
  })
  .bind(format!("{}:{}",config.server.host,config.server.port))?
  .run()
  .await
}
