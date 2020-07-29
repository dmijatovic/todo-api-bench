# Todo express api

This api is build using [express node server](https://expressjs.com/en/guide/routing.html). Express is most popular server in the NodeJS comminity. It should be slower than Polka server which is build to be light and fast. Using this benhmark I will test this on todo api app.

## Usage

To start the todo api use docker-compose file. The api should be avaliable on localhost:8083 by default.

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
npm run test:js-polka

# see reports on localhost:3000
npm run dev
```
