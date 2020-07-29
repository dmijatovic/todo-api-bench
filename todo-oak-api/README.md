# Todo api with DENO and OAK

This api is build using [deno oak server](https://deno.land/x/oak). Oak is popular server in Deno community.

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

## Building

```bash
# run deno
deno run --allow-net --allow-read --allow-env ./src/main.ts

# cache dependencies locally
deno cache ./src/main.ts
# build app in dist folder
# dist folder need to exist
deno bundle ./src/main.ts ./dist/api.bundle.js

# run build app
deno run --allow-net --allow-env dist/api.bundle.js
```

## Development

For development we use denon (nodemon look-a-like).

```bash
# install denon
deno install --allow-read --allow-run --allow-write --allow-net -f --unstable https://deno.land/x/denon@2.3.0/denon.ts

# use denon to restart
denon run --allow-net --allow-env ./src/main.ts

```
