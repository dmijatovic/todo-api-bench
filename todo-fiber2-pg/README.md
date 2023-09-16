# Fiber and Postgres 15

This project is created to benchmark postgres drivers with golang fiber.
The ideas is based on my experience during making todo-bench project where I noticed that postgres and the speed of the driver high likely plays important role in the overall results of my benchmark. In that project Golang did not score particulairly well compared to rust/actix. I have created 2 golang projects, one with Fiber and one with Mux. Both had quite comparable score. Looking at some other benchmarks the fiber performance should be higher than mux performance. One of my conclusion is that the performance of golang projects is limited by the pg driver I used.

Then I read this [article, which confirms my assumptions](https://levelup.gitconnected.com/fastest-postgresql-client-library-for-go-579fa97909fb#:~:text=By%20looking%20at%20the%20result,based%20on%20your%20own%20environment.)

Based on the scores in that article I decided to try to benchmark few pg drivers for golang, starting with the most performant pgx and widely used pg.

## Requirements

This project requires Postgres server running. Use docker compose file in the postgres folder

```bash
# navigate to postgres folder
cd postgres
# start postgres with required user and database
docker compose up -d
```

### Docker image learnings

When using Fiber in multi-proccess mode (prefork) there is a problem on debian image because prefork aborts when PID=1. However in debian docker image this pid can be obtained by Go app. For solution see this [issue](https://github.com/gofiber/fiber/issues/1036)

- This app on Debian 12 image: 132MB
- This app on distroless debian 11: 36MB
- This app on busybox: 20MB
- This app on `scratch`: 16MB

**Fiber has problems running multiple processes in basic Debian, bussybox and scratch images. By default fiber will use pid=1 and will abort in prefork mode if pid=1!**
To solve this add pid:host to docker-compose.yml file in the fiber service like shown bellow.

```yml
  ...
  todo-api:
    container_name: todo-api
    build: .
    image: dv4all/todo-fiber2-api:0.0.1
    # added to prevent fiber using pid=1 which disables perfork mode!!!
    pid: host
    environment:
      API_NAME: todo-api
      API_HOST: 0.0.0.0:8080
      # run multiple processes, default is false
      API_PREFORK: true
      # how many child processes to run
      API_MAXPROC: 3
      PG_HOST: pgdb
      PG_PORT: 5432
      PG_USER: postgres
      PG_PASS: changeme
      PG_DB: todo_db
      # PG_POOL.MAX_SIZE: 30
    ports:
      - "8080:8080"
    networks:
      - net
    depends_on:
      - pgdb
  ...

```

### From SCRATCH image

When using baremetal image scratch to run golan executable, the build requires flags indicating that executable will be used as standalone.

```Dockerfile
FROM golang:1.21 AS build

# install build tools
# RUN apk add --update gcc musl-dev

WORKDIR /app

COPY . .

# Build standalone executable for use in scratch (no container)!
RUN CGO_ENABLED=0 go build \
    -installsuffix 'static' \
    -o todoapi

# RELEASE image - 16MB
# CANNOT run fiber in multiple processes!!!
FROM scratch

WORKDIR /app

# copy compiled file
COPY --from=build /app/todoapi /app/
# copy static folder (serving static files)
COPY ./static /app/static

# port to connect to postgres
EXPOSE 5432
# EXPOSE 8080

ENTRYPOINT ["/app/todoapi"]
# CMD ["/app/todoapi"]

```
