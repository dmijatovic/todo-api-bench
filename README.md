# Todo API load tests

Testing various api technologies and learning how to use them.

## Disclaimer

My experience with some of used technologies is limited. The scores might not reflect the full potential of the language or used library. Although these solutions seem reasonably simple there are still a lot of factors that influence the scores. All feedback, advice and contribution is welcome. I am interested in bringing all of used technologies to their maximum performance and increase my knowledge.

## Background

I primarily used nodejs and express to serve data to my frontends in the past. Over the time I have seen alternative solutions my clients used for developing the api's for web applications. I see a number of interesting alternatives to nodejs/express in 2020. My goal is to test populair and performant approaches for building api's in the open source world, covering programming languages I already know (JavaScript, Python) and 2 new languages. I selected Go and Rust because these are modern languages and web oriented. During my investigation I came across discussions about the performance of various api libraries. That brought me to idea to create this repo with all api solutions I am interested in and to perform load tests on each of them. For load tests I used [autocannon](https://github.com/mcollina/autocannon).

Api server is an important part of the backend solution. Another important part is the database. I use identical PostgreSQL docker container with all api's. Postgres is well supported in all technologies I want to test and quite popular and performant.

## Performance overview

Below it the overview of tested techologies and my personal opinion. The performance is rated on 5-point scale: excellent, very good, good, fair and poor. Note! that **I have not rated any of api's to have poor performance**. The ease of creating the api is rated on 4-point scale: easy, fair, hard and very hard. Rust was without doubt the hardest api for me to develop. For me was Golang lot easier to learn.

| Api               | Langauge       | Library   | Performance | Ease | Size MB\*\* | My Rank |
| ----------------- | -------------- | --------- | ----------- | ---- | ----------- | ------- |
| todo-actix-api    | Rust           | actix-web | excellent   | hard | 10 - 80     | 3       |
| todo-bun-elysia   | Bun            | elysia    | very good   | easy | 100 - 150   | 2       |
| todo-bun-pgjs     | Bun            | elysia    | excellent   | easy | 100 - 150   | 2       |
| todo-express-api  | NodeJS         | express   | good        | easy | 40 - 200    | 3       |
| todo-fast-api     | Python         | fastapi   | good        | fair | 300         | 3       |
| todo-fastify-api  | NodeJS         | fastify   | very good   | easy | 40 - 200    | 2       |
| todo-fiber1-api   | Golang         | fiber v1  | good        | easy | 16          | 3       |
| todo-fiber2-pg    | Golang         | fiber v2  | very good   | easy | 16          | 2       |
| todo-fiber2-pgx   | Golang         | fiber v2  | excellent   | easy | 10          | 1       |
| todo-flask-api    | Python         | flask     | fair        | easy | 70          | 4       |
| todo-h3-api       | NodeJS         | h3, pg.js | good        | fair | 40 - 200    | 2       |
| todo-h3-pgjs      | NodeJS         | h3        | very good   | fair | 40 - 200    | 2       |
| todo-hasura-api   | Haskel/GraphQL | hasura    | fair        | fair | ??          | 4       |
| todo-mux-api      | Golang         | net/http  | good        | hard | 14          | 4       |
| todo-oak-api      | Deno           | oak       | good        | fair | 131         | 3       |
| todo-polka-api    | NodeJS         | polka     | very good   | fair | 40          | 2       |
| todo-postgrest-api| Haskel         | postgrest | good        | easy | 20          | 3       |

\*\* Docker image size produced by Dockerfile used for the benchmark run. Minimal image size is achieved using alpine but it has impact on the maximum performance of node libraries (fastify, express, polka and h3). It seems to me that maximal performance with node libraries and the reasonable image size is achieved using node-debian-slim as base image.

### Links to used libraries

- `Golang`: Default [net/http](https://golang.org/pkg/net/http/) library is used and [fiber](https://github.com/gofiber/fiber) which advertise itself to be very fast and uses kind-of-express-way approach (easy to switch from NodeJS/Express).
- `Rust`: [Actix-web](https://github.com/actix/actix-web) is popular in Rust world and achieves the highest performance scores in the [benchmark](https://www.techempower.com/benchmarks/#section=data-r0&hw=ph&test=composite&a=2). In my load tests too it is the fastest api library.
- `NodeJS`: [Polka](https://github.com/lukeed/polka) seem to be advertised as the fastest NodeJS web server. [Express](https://expressjs.com/) is used as a benchmark to Polka and as most popular node api server. The node library [fastify](https://www.fastify.io/) is also added after becoming more popular. The last node library added is [h3](https://github.com/unjs/h3), which is very light solution used by Nuxt. The libraries polka, fastify and h3 achieved very good results!
- `Deno`: It is new technology recently moved to version 1. Most popular choice medio 2020 seem to be [Oak](https://github.com/oakserver/oak) http server. In 2023 I excluded it from benchmark test because updates are required and I have not found time yet to do that.
- `Python`: [Flask](https://flask.palletsprojects.com/en/1.1.x/) is popular basic web server widely used. [FastApi](https://github.com/tiangolo/fastapi) is marked as the fastest python library for api's. My tests confirm that FastApi is significantly faster than flask.
- `GraphQL`: is alternative approach to standard REST api architecture. All other api's use REST approach. [Hasura](https://hasura.io/docs/1.0/graphql/manual/index.html) api, which is Haskel/GraphQL/Postgres implementation, implements the GraphQL endpoint and offers basic CRUD operations out of the box. It was quite easy to implement basic CRUD operations with Hasura. The performance is lower, which I expected, and the amount of traffic is significantly higher, which was surpring to me.
- `Bun`: I created two api using different postgress drivers. Bun seem to be perform better than node api's. The scores are high especially on Mac M2 machine.

## What these load test results mean actually (?)

Load tests of each solution give the `combined performance result` which include:

- the efficiency of used language (JavaScript, Python, Go, Rust, Haskel)
- the efficiency of http library and the router (tls/https is not used)
- the efficiency of library used to communicate with PostgreSQL (db driver)
- the efficiency of machine running the load tests
- how well composed Docker containers (Linux Alpine or Debian OS) perform on the test machine

## Conclusion

I runned load tests on multiple machines (4 laptops and 2 desktops). The results are saved in the separate json files. There are significant differences in the ranking between used hardware/machines. This is a bit surprising. It seems that different programming languages and libraries utilize specific hardware better. The difference between Intel, AMD and Apple M2 processors is significant. Actix shows better performance on the Intel processors and node/bun on the Mac M2 processor.

Note that my knowledge of specific libraries is limited and has influence on the scores. For example the performance of Fiber v2 api significantly improved after tweaking the api for the number of processes used. Significant fluctuations in the actix-api performance were also caused by experimenting with the number of used workers. I also noticed that different potgress libraries (drivers) have a significant influence on the overall api performance. See the differences in scores between todo-fiber2-pg and todo-fiber2-pgx, todo-bun-elysia and todo-bun-pgjs, todo-h3-api and todo-h3-pgjs. These api's are identical but use different postgress libraries.

The absolute scores/numbers per machine are different, but `golang-fiber2 and rust actix-web are clearly one of the fastest and python/flask and hasura are the slowest`. NodeJS (h3, polka, express), Deno (oak) and Golang api's (fiber v1 and the standard http/mux) are usually in the middle of the chart. In the past the Python FastAPI was performing very close to Golang and NodeJS/Deno api's after I optimized number of workers. Unfortunatelly I decided to exclude it in 2023 because the api was not able to run on Mac M2 chip without an upgrade and currently I have no time to upgrade it.

Based on the load tests and my experience trying new languages Golang and Rust I decided to invest more time in learning Golang rather than Rust. Rust is powerfull language but requires (lot) more time untill sufficient level is reached.

New surprises in 2023 are bun-postgres.js and h3-postgres.js. They performs very well, especially on Mac M2 machines. Definetly word checking them if you preffer using node ecosystem.

## Run load tests

This repo requires `docker and docker-compose` to run todo api's. For running load test and viewing all results you need `nodejs and npm`.

Running the load tests for the first time will require more time than the subsequent runs because all docker images need to be downloaded to your local machine.

The easiest way to run load tests on Linux/Mac is to use test-round.sh bash script. The script will create required containers in the background, run the test and then cleanup containers and the volumes used. You might need to make the script executable first.

```bash
# go to tests folder
cd tests
# install dependencies
npm install
# go back to root
cd ../
# make executable (if needed)
sudo chmod +x test-round.sh
# run test-round shell script (linux/MacOS)
./test-round.sh
```

## Contribution

All contributions are more than welcome as I am interested in bringing all of the used technologies to maximum performance and increase my knowledge.

If you want to contribute the scores of your machine please do so. Based on my experience with running the api's on three different machines I expect that results on some other machines (and OS-es) could be quite different.

### Api requirements

To run benchamrk you should implement api [according to this readme.md file](./tests/autocannon/README.md).

### Include your api to tests

1. Your contribution should be created in a new todo-[language]-[framework] folder. In this folder you can place your source code however you like. Only requirement is that docker-compose.yml file should be in the root of your folder. We use docker compose to run your solution.
2. Add new load test script in the tests/autocannon folder and include it package.json.

For more information you can look at following files:
- `loadtest.sh`: running load test of single api solution
- `docker-compose.yml`: env variables used to ensure similar setup
- `load_test_[solution].js`: autocannon load test script. For example have a look at './tests/autocannon/load_test_bun_pgjs.js'
- `./tests/package.json`: see scripts section for calling a load tests for a solition
