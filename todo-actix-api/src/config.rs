use serde::Deserialize;
use config::ConfigError;

#[derive(Deserialize)]
pub struct ServerConfig{
  pub host: String,
  pub port: i32,
  pub workers: u8,
}

#[derive(Deserialize)]
pub struct Config {
  pub server:ServerConfig,
  pub pg: deadpool_postgres::Config
}

// Config factory (class?!?)
impl Config {
  pub fn from_env() -> Result<Self,ConfigError> {
    let mut cfg = config::Config::new();
    cfg.merge(config::Environment::new())?;
    cfg.try_into()
  }
}