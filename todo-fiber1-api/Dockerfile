FROM golang:alpine3.12 AS build

# install build tools
RUN apk add --update gcc musl-dev

WORKDIR /home/build

COPY . .

RUN go build -o=todoapi

# RELEASE image
# THERE IS A PROBLEM when using multiple processes in fiber on ALPINE image
FROM alpine:3.12

WORKDIR /home/dv4all

COPY --from=build /home/build/todoapi /home/dv4all
COPY ./static /home/dv4all/static

EXPOSE 5432
# EXPOSE 8080

CMD ["/home/dv4all/todoapi"]

