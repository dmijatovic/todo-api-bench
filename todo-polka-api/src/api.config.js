module.exports = {
  "apiName":"todo-polka-api",
  "apiPort":8083,
  "jwtOptions":{
    "algorithm": "HS512",
    "expiresIn": 60,
    "issuer": "dv4all"
  },
  "pgOptions":{
    "host": "pgdb",
    "port": 5432,
    "database":"todo_db",
    "user":"postgres",
    "password": "changeme",
    "max":20
  },
  "hashOptions":{
    "saltRounds":7
  },
  "privateKey":"234234kesdfskdvk!@E^sdfsd&90-we4we"
}