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
docker compose up -d
# wait
take_a_break 20
# run load test
loadtest test:rs-actix
# close docker
cd ../todo-actix-api
docker compose down --volumes
# wait
take_a_break 10

# ---------------------
# BUN elysa load test
# start api
cd ../todo-bun-elysia
docker compose up -d
# wait
take_a_break 20
# run load test
loadtest test:bun-elysia
# close docker
cd ../todo-bun-elysia
docker compose down --volumes
# wait
take_a_break 10

# ---------------------
# EXPRESS load test
# start express api
cd ../todo-express-api
docker compose up -d
# wait
take_a_break 20
# run load test
loadtest test:js-express
# close docker
cd ../todo-express-api
docker compose down --volumes
# wait
take_a_break 10

# DOES NOT work in 2023
# NOT WORKING ON Mac M2 chip?
# # # ---------------------
# # # FASTAPI load test
# # # start fast api
# cd ../todo-fast-api
# docker compose up -d
# # wait
# take_a_break 20
# # run load tests
# loadtest test:py-fast-api
# # close docker
# cd ../todo-fast-api
# docker compose down --volumes
# # wait
# take_a_break 10

# ---------------------
# FASTIFY load test
# start fastify api
cd ../todo-fastify-api
docker compose up -d
# wait
take_a_break 20
# run load test
loadtest test:js-fastify
# close docker
cd ../todo-fastify-api
docker compose down --volumes
# wait
take_a_break 10

# ---------------------
# FIBER v1 load test
# start fiber api
cd ../todo-fiber1-api
docker compose up -d
# wait
take_a_break 20
# run load tests
loadtest test:go-fiber1
# close docker
cd ../todo-fiber1-api
docker compose down --volumes
# wait
take_a_break 10

# ---------------------
# FIBER v2  pgx load test
# start fiber api
cd ../todo-fiber2-pgx
docker compose up -d
# wait
take_a_break 20
# run load tests
loadtest test:go-fiber2-pgx
# close docker
cd ../todo-fiber2-pgx
docker compose down --volumes
# wait
take_a_break 10

# ---------------------
# FIBER v2 pg load test
# start fiber api
cd ../todo-fiber2-pg
docker compose up -d
# wait
take_a_break 20
# run load tests
loadtest test:go-fiber2-pg
# close docker
cd ../todo-fiber2-pg
docker compose down --volumes
# wait
take_a_break 10

# ---------------------
# FLASK load test
# start flask api
cd ../todo-flask-api
docker compose up -d
# wait
take_a_break 20
# run load tests
loadtest test:py-flask
# close docker
cd ../todo-flask-api
docker compose down --volumes
# wait
take_a_break 10

# ---------------------
# H3 load test
# start h3 api
cd ../todo-h3-api
docker compose up -d
# wait
take_a_break 20
# run load tests
loadtest test:js-h3
# close docker
cd ../todo-h3-api
docker compose down --volumes
# wait
take_a_break 10

# ---------------------
# Hasura GraphQL load test
# start polka api
cd ../todo-hasura-api
docker compose up -d
# wait - hasura needs more time to spanup all containers
take_a_break 60
# run load tests
loadtest test:ql-hasura
# close docker
cd ../todo-hasura-api
docker compose down --volumes
# wait
take_a_break 10

# remove to keep to 12 items
# # ---------------------
# # GO MUX load testclear
# # start mux api
# cd ../todo-mux-api
# docker compose up -d
# # wait
# take_a_break 20
# # run load tests
# loadtest test:go-mux
# # close docker
# cd ../todo-mux-api
# docker compose down --volumes
# # wait
# take_a_break 10

# DOES NOT work in 2023
# DOES not work on Mac M2 chip
# ---------------------
# DENO OAK load test
# start oak api
# cd ../todo-oak-api
# docker-compose up -d
# # wait
# take_a_break 20
# # run load tests
# loadtest test:ts-oak
# # close docker
# cd ../todo-oak-api
# docker-compose down --volumes
# # wait
# take_a_break 10

# ---------------------
# Node Polka load test
# start polka api
cd ../todo-polka-api
docker compose up -d
# wait
take_a_break 20
# run load tests
loadtest test:js-polka
# close docker
cd ../todo-polka-api
docker compose down --volumes
# wait
take_a_break 10

# ---------------------
# Haskel Postgrest load test
# start postgrest api
cd ../todo-postgrest-api
docker compose up -d
# wait
take_a_break 20
# run load tests
loadtest test:postgrest-api
# close docker
cd ../todo-postgrest-api
docker compose down --volumes
# wait
# take_a_break 5
# notify
echo "All load tests completed..."
