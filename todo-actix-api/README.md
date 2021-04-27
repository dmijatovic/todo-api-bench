# Todo actix api (rust)

This api is build using [actix web framework](https://github.com/actix/actix-web).

**In select statement there is a LIMIT set to 50 todo list items!**

## Usage

To start the todo api use docker-compose file. The api should be available on localhost:8080 by default.
There are 2 docker files:

- Basic: this file uses rust image 1.45-slim to build rust application and for release uses debian:10-slim. The `image size is 80MB`. This file is initally used but later I moved to second version.
- From scratch: this approach builds application and uses FROM scratch docker image (empty). The `image size is 10MB`. With this approach we only set application in the image. We do need to take care that all resources used by application are included in the image. In addition, the compilation target need to be native linux (x86_64-unknown-linux-musl).

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
npm run test:rs-actix

# see reports on localhost:3000
npm run dev
```

## Remarks

After experimenting with different amount of workers om my fastest machine I achieved highest score with 2 workers (301k on 30sec. load test). Increasing the number of workers to 3,4 and even 8 produced lower scores. Or reducing to 1 workes yield lower result. There is a link between number of workers and the api performance but the higher is not always better.
