# Todo api in python with fastapi, uvicorn and database

At the moment the fastest api solution with python seem to be [FastAPI using async SQL database](https://fastapi.tiangolo.com/advanced/async-sql-databases/). For database we use PostgreSQL (as with others).

In the first version I decided not to use SqlAlchemy to keep api simple and light. The databases module supports the basic CRUD queries I want to test.
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
npm run test:py-fast

# see reports on localhost:3000
npm run dev
```

## Database driver and asyncpg

For more information about [database](https://www.encode.io/databases/database_queries/) and [asyncpg](https://github.com/MagicStack/asyncpg) see provided links.

## Dependencies

```bash
# install all dependencies (one by one)
pip install fastapi uvicorn databases databases[postgresql] asyncpg

# install using requirements.txt
pip install -r requirements.txt
```
