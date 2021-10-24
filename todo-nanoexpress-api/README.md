# Todo nanoexpress api

This api is build using [nanoexpress node server](https://nanoexpress.js.org/).

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
npm run test:js-nanoexpress

# see reports on localhost:3000
npm run dev
```

## Dependencies

**Nanoexpress depends on [uWS](https://github.com/uNetworking/uWebSockets) which is not avaliable via NPM**.

```bash
# project dependencies
npm i -s nanoexpress pg
# dev dependencies
npm i -D @zeit/ncc nodemon
```

## Dockerfile

Nanoexpress depends on uWS native C++ library. When compiling the code into one file we also need to include these files.
In addition, the uWS C++ file is not fully compatible with Alipine version of linux. So I used node:v12-buster-slim and copy uWS native files from nanoexpres/node_modules to package folder.

`Note! Simple alpine version does not works (Dockerfile_alpine)`

```Dockerfile
# copy C++ uws files for linux (we use debian as base image)
COPY --from=build /home/dv4all/node_modules/nanoexpress/node_modules/uWebSockets.js/uws_linux_x64* ./
```
