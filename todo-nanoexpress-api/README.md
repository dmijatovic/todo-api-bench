# Todo nanoexpress api

This api is build using [nanoexpress node server](https://nanoexpress.js.org/). .

**In select statement there is a LIMIT set to 50 todo list items!**

## Usage

To start the todo api use docker-compose file. The api should be available on localhost:8083 by default.

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
npm run test:js-express

# see reports on localhost:3000
npm run dev
```

## Dependencies

```bash
# project dependencies
npm i -s nanoexpress pg
# dev dependencies
npm i -D @zeit/ncc nodemon
```

## Dockerfile

Nanoexpress depends on uWS native C++ library. When using node-alpine version we need to link to proper uWS library.

`Note! Simple alpine version does not works (Dockerfile_alpine)`

```Dockerfile
# link to proper lib for alpine version
RUN ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2

```
