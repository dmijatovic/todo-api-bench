#!/bin/bash

# Load test execution
loadtest(){
  # navigate to tests folder
  cd ../tests/
  # start load test
  npm run $1
}

take_a_break(){
  # wait for 30 sec
  echo "sleep...$1 sec"
  sleep $1
}

# ---------------------
# ACTIX load test
# start actix api
cd todo-actix-api
docker-compose up -d
# wait
take_a_break 45
# run load test
loadtest test:rs-actix
# close docker
cd ../todo-actix-api
docker-compose down --volumes
# wait
take_a_break 5

# ---------------------
# DOTNET load test
# start express api
cd ../todo-dotnet-api
docker-compose up -d
# wait
take_a_break 45
# run load test
loadtest test:dotnet-mssql
# close docker
cd ../todo-dotnet-api
docker-compose down --volumes
# wait
take_a_break 5

# ---------------------
# EXPRESS load test
# start express api
cd ../todo-express-api
docker-compose up -d
# wait
take_a_break 45
# run load test
loadtest test:js-express
# close docker
cd ../todo-express-api
docker-compose down --volumes
# wait
take_a_break 5

# ---------------------
# FASTAPI load test
# start fast api
cd ../todo-fast-api
docker-compose up -d
# wait
take_a_break 45
# run load tests
loadtest test:py-fast
# close docker
cd ../todo-fast-api
docker-compose down --volumes
# wait
take_a_break 5

# ---------------------
# FASTIFY load test
# start fastify api
cd ../todo-fastify-api
docker-compose up -d
# wait
take_a_break 45
# run load test
loadtest test:js-fastify
# close docker
cd ../todo-fastify-api
docker-compose down --volumes
# wait
take_a_break 5

# ---------------------
# FIBER load test
# start fiber api
cd ../todo-fiber-api
docker-compose up -d
# wait
take_a_break 45
# run load tests
loadtest test:go-fiber
# close docker
cd ../todo-fiber-api
docker-compose down --volumes
# wait
take_a_break 5

# ---------------------
# FLASK load test
# start flask api
cd ../todo-flask-api
docker-compose up -d
# wait
take_a_break 45
# run load tests
loadtest test:py-flask
# close docker
cd ../todo-flask-api
docker-compose down --volumes
# wait
take_a_break 5

# ---------------------
# Hasura GraphQL load test
# start polka api
cd ../todo-hasura-api
docker-compose up -d
# wait
take_a_break 45
# run load tests
loadtest test:ql-hasura
# close docker
cd ../todo-hasura-api
docker-compose down --volumes
# wait
take_a_break 5

# ---------------------
# GO MUX load test
# start mux api
cd ../todo-mux-api
docker-compose up -d
# wait
take_a_break 45
# run load tests
loadtest test:go-mux
# close docker
cd ../todo-mux-api
docker-compose down --volumes
# wait
take_a_break 5

# ---------------------
# NANOEXPRESS load test
# start express api
cd ../todo-nanoexpress-api
docker-compose up -d
# wait
take_a_break 45
# run load test
loadtest test:js-nanoexpress
# close docker
cd ../todo-nanoexpress-api
docker-compose down --volumes
# wait
take_a_break 5

# ---------------------
# DENO OAK load test
# start oak api
cd ../todo-oak-api
docker-compose up -d
# wait
take_a_break 45
# run load tests
loadtest test:ts-oak
# close docker
cd ../todo-oak-api
docker-compose down --volumes
# wait
take_a_break 5

# ---------------------
# Node Polka load test
# start polka api
cd ../todo-polka-api
docker-compose up -d
# wait
take_a_break 45
# run load tests
loadtest test:js-polka
# close docker
cd ../todo-polka-api
docker-compose down --volumes

# ---------------------
# Supabase load test
# start polka api
cd ../todo-supabase-api
docker-compose up -d
# wait
take_a_break 45
# run load tests
loadtest test:supabase-api
# close docker
cd ../todo-supabase-api
docker-compose down --volumes

