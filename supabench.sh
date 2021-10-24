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
take_a_break 30
# run load test
loadtest test:rs-actix
# close docker
cd ../todo-actix-api
docker-compose down --volumes
# wait
take_a_break 5

# ---------------------
# FASTIFY load test
# start fastify api
cd ../todo-fastify-api
docker-compose up -d
# wait
take_a_break 30
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
take_a_break 30
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
take_a_break 30
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
take_a_break 60
# run load tests
loadtest test:ql-hasura
# close docker
cd ../todo-hasura-api
docker-compose down --volumes
# wait
take_a_break 5

# ---------------------
# DENO OAK load test
# start oak api
cd ../todo-oak-api
docker-compose up -d
# wait
take_a_break 30
# run load tests
loadtest test:ts-oak
# close docker
cd ../todo-oak-api
docker-compose down --volumes
# wait
take_a_break 5

# ---------------------
# Supabase load test
# start polka api
cd ../todo-supabase-api
docker-compose up -d
# wait
take_a_break 30
# run load tests
loadtest test:supabase-api
# close docker
cd ../todo-supabase-api
docker-compose down --volumes

