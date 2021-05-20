# Hasura Todo api

This api is todo demo, just as other todo-api but then with [Hasura](https://hasura.io/docs/1.0/graphql/manual/index.html).
Hasura is GraphQL engine (api) designed to work 'out of the box' with Postgres. It automatically creates CRUD queries with GraphQL.

However when first started up it needs to select tables in order to create queries. In order to be able to start todo-api with created tables and hasura definitions we need to apply Hasura migrations.

**In select statement of loadtest I set a LIMIT to 50 todo list items! This is inline with other API's**

## Usage

To start the todo api use docker-compose file. The api should be available on localhost:8087 by default.

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
npm run test:ql-hasura

# see reports on localhost:3000
npm run dev
```

## Hasura migration

The migration scripts are stored in hasura folder.

1. Start hasura api using docker-compose

```bash
# navigate to migration folder
docker-compose up
```

2. Start hasura-cli

```bash
# start cli - project name migration
hasura init
# navigate to folder
cd hasura

# create metadata info
hasura export metadata

```

3. Create database migration

```bash
# create init migration
hasura migrate create "init" --from-server

# check status
hasura migrate status

# apply script to database
# or define migration and metadata folders
hasura migrate apply
```

4. Add migration info to docker-compose

```yml
volumes:
  # mount migration script (create tables)
  - ./hasura/migrations:/hasura/migrations
  # mount metadata info
  - ./hasura/metadata:/hasura/metadata
```

## Healthcheck Postgres container

During starting docker-compose there we some error messages from hasura about establishing connection to postgres at inital startup. At inital startup Postgres needs some time to create database and startup. I added healthchecks to pgdb section.

```yml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 10s
  timeout: 5s
  retries: 3
```
