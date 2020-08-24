# Todo actix api (rust)

This api is build using [actix web framework](https://github.com/actix/actix-web).

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
npm run test:rs-actix

# see reports on localhost:3000
npm run dev
```

## Remarks

After experimenting with different amount of workers om my fastest machine I achieved highest score with 2 workers (301k on 30sec. load test). Increasing the number of workers to 3,4 and even 8 produced lower scores. Or reducing to 1 workes yield lower result. There is a link between number of workers and the api performance but the higher is not always better.
