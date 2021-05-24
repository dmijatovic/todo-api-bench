# Todo fasitfy api

This api is build using [fastify node server](https://www.fastify.io/).

**In select statement there is a LIMIT set to 50 todo list items!**

## Usage

To start the todo api use docker-compose file. The api should be available on localhost:8079 by default.

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
npm run test:js-fastify

# see reports on localhost:3000
npm run dev
```