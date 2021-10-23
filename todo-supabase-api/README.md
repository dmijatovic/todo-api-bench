# Todo supabase api

This api is build using [supabase](https://supabase.io/docs/guides/api).
Supabase is an suite of tools for rapid development and uses Postgres database as its main data storage.

The module postgREST exposes the data tables through REST API and automatically enables CRUD oprations.
Therefore there is no API code written in this section. Supabase provides CRUD API directly out-of-the-box.

**In select statement there is a LIMIT set to 50 items!**

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
npm run test:supabase-api

# see reports on localhost:3000
npm run dev
```

## Dependencies

Supabase is set of different tools and rest API is on of the tools in this collection. For the rest API supabase uses postgREST framework to automatically expose API endpoint on the tables created in postgres database.
