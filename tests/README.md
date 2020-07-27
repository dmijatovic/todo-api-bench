# API load test and report

The load test is performed with autocannon.

An simple table report is shown using nextjs.

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
