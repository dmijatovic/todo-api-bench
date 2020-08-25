# Todo api in Golang

This demo is created to bachmark golan basic http module agains go fiber and api modules in some other languages like NodeJS (polka), Rust (actix) and Flask in python.

The load test are performed with autocannon (nodejs) in all cases. Load test are performed on todo api point which does not requires authentication. I might later include JWT token authentication. At this point we test basic read (home), read of items from database and insert into database. In generall the i/o is usually the bottleneck. I am interested does it makes a sense to have fast api server while we know that writing/reading to the database usually is the slowest operation. Therefore postgres database with exactly same specs will be used in all these banchmarks, what will be different are the http api servers.

The results of load tests are saves in tests folder as json files.

## Dependecies

This api uses all standard/default golang modules for http and postgress connection.

## Usage

To start the todo api use docker-compose file. The api should be available on localhost:8080 by default.

```bash

#start todo api
docker-compose up -d

# check if it is running
docker-compose ps

# close api
docker-compose down

# close api and remove data volume
docker-compose down --volumes

```

## Running tests

The test are perfomed using autocannon. You need to have NodeJS installed to use autocannon. If you running tests for the fist time you will also need to install dependencies using NPM. See readme file in tests folder.

Navigate to tests folder and start the tests.

```bash
# change to tests folder from here
cd ../tests

# OPTIONAL: if not installed run npm install

# run test
npm run test:go-mux

# see reports on localhost:3000
npm run dev
```
