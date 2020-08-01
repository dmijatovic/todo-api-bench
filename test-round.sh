#!/bin/bash

# Load test execution
loadtest(){
  # navigate to tests folder
  cd ../tests/
  # wait for 5 sec before test
  sleep 5
  # start load test
  npm run $1
}

# ---------------------
# ACTIX load test
# start actix api
cd todo-actix-api
docker-compose up -d
# run load test
loadtest test:rs-actix
# close docker
cd ../todo-actix-api
docker-compose down --volumes


# ---------------------
# EXPRESS load test
# start express api
cd ../todo-express-api
docker-compose up -d
# run load test
loadtest test:js-express
# close docker
cd ../todo-express-api
docker-compose down --volumes

# ---------------------
# FASTAPI load test
# start fast api
cd ../todo-fast-api
docker-compose up -d
# run load tests
loadtest test:py-fast
# close docker
cd ../todo-fast-api
docker-compose down --volumes

# ---------------------
# FIBER load test
# start fiber api
cd ../todo-fiber-api
docker-compose up -d
# run load tests
loadtest test:go-fiber
# close docker
cd ../todo-fiber-api
docker-compose down --volumes

# ---------------------
# FLASK load test
# start flask api
cd ../todo-flask-api
docker-compose up -d
# run load tests
loadtest test:py-flask
# close docker
cd ../todo-flask-api
docker-compose down --volumes

# ---------------------
# GO MUX load test
# start mux api
cd ../todo-mux-api
docker-compose up -d
# run load tests
loadtest test:go-mux
# close docker
cd ../todo-mux-api
docker-compose down --volumes

# ---------------------
# DENO OAK load test
# start oak api
cd ../todo-oak-api
docker-compose up -d
# run load tests
loadtest test:ts-oak
# close docker
cd ../todo-oak-api
docker-compose down --volumes

# ---------------------
# Node Polka load test
# start polka api
cd ../todo-polka-api
docker-compose up -d
# run load tests
loadtest test:js-polka
# close docker
cd ../todo-polka-api
docker-compose down --volumes