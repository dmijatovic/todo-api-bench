# Todo api in Golang

This demo is created to bachmark golan basic http module agains go fiber and api modules in some other languages like NodeJS (polka), Rust (actix) and Flask in python.

The load test are performed with autocannon (nodejs) in all cases. Load test are performed on todo api point which does not requires authentication. I might later include JWT token authentication. At this point we test basic read (home), read of items from database and insert into database. In generall the i/o is usually the bottleneck. I am interessted does it makes a sense to have fast api server while we know that writing/reading to the database usually is the slowest operation. Therefore postgres database with exactly same specs will be used in all these banchmarks, what will be different are the http api servers.

The results of load tests are saves in tests folder as json files.

## Dependecies

This api uses all standard/default golang modules for http and postgress connection.

## Dockerfile

The app is build using docker file. Complete service incl. postgres database is started using docker-compose file.
