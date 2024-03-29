# API load test and report

The load test is performed with autocannon. An simple report is shown using nextjs.

**In order to measure performance with similair amount of records the GET route for all todo lists has a LIMIT set to 50 items in each API!**

## Installation

From this folder run `npm install`. Note! You need to have node.js installed. I use NodeJS v14.

## Run load tests

There are 3 stages for performing complete load test run and view the results.

### Start the api you want to test

First you need to start api using docker compose. It is advised to run each api separately, so start docker compose and close it before running the next test.

```bash
# sample running todo-go-http api
# go to todo-go-http folder
cd ../todo-go-http
# run api docker-compose file (in detached mode)
docker-compose up -d
# check if it running
docker-compose ps
# go to next step: Run autocannon test
```

### Run autocannon test for this api

Each api has its own autocannon script. These scripts are placed in autocannon folder. You can run any of the tests using npm run. All npm run scripts are in package.json.

```bash
# npm run test:<api-name>
# to run actix test (rust api)
npm run test:rs-actix
```

To chage autocannon settings you will need to modify nodejs scripts in the autocannon folder.

### View report

```bash
# start nextjs in dev mode
npm run dev
# report will be shown on http://localhost:3000
```

## Endpoints tested

In the 2023 update we want to test identical endpoints and achieve idential load as much as possible. There might be slight differences but the idea is to align (at least) all REST api to use identical tests. GraphQL is different concerning the endpoint approach but the comparable load and operations will be tested. [Detailed description of api endpoints is here](./tests/autocannon/README.md)

- `GET /` homepage is simple json return with message:"OK" or something like that
- `POST /list` create new todo list
- `PUT /list/{lid}` update existing todo list
- `POST /todo` create todo item
- `PUT /todo/{todo_id}` update todo item by id
- `GET /list` LIMIT to 50 items!
- `GET /list/{list_id}/todo` get all todo items of specific list based on list_id. LIMIT to 50 items!
- `GET /todo/{todo_id}` get todo items by id
- `DELETE /todo/{todo_id}` get specific todo by id
<!-- NOT IMPLEMENTED -->
- `GET /list/{list_id}` get a specific todo list.

**For GET request that can return lot of items set LIMIT to 50 items!**
**MAX_POOL_SIZE to be 30, if it can be defined**
**SERVER.WORKERS to be set to 4, if it can be defined**
