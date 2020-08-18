# Todo API load tests

Testing api techologies performance and learning how to (properly) use them.

## Dislaimer

My experience in some of the technologies is limited. The scores might not reflect the full potential of the language or used library. All feedback, advice and contribution is welcome. I am interessted in bringing all of used techologies to their maximum performace and increase my knowledge.

## Background

I primarily used nodejs and express to serve data to my frontends in the past. Over the time I have seen alternative solutions my clients used for developing the api's for web applications. I see a number of interessting alternatives to nodejs/express in 2020. My focus is to test currently populair approaches in the open source world, covering the languages I alrady know (JavaScript, Python) and 2 new languages. I have selected Go and Rust because these are modern languages and stronly web related. I discared Java, C++, PHP and many others by my personal prefference what I would like to learn. During my investigation I saw discussions about the performance of various api libraries. I got the idea to create one repo with all api solutions and perform load tests on each of them.

Api server is important part of backend solution. Other important part is the database. To limit the variations I use PostreSQL with all api. Postgres is well supported in all technologies I want to test and quite populair at the moment.

## Used technologies

I have tested following api libraries:

- `Golang`: Basic [net/http/mux](https://golang.org/pkg/net/http/) and [fiber](https://github.com/gofiber/fiber) which seem to be fast and uses kind-of-express-way routing idea.
- `Rust`: I started with [actix-web](https://github.com/actix/actix-web) which is popular and achieves the highest performance scores in the benachmark.
- `NodeJS`: I wanted to try [polka](https://github.com/lukeed/polka) because it seem to be one of the fastest nodejs servers. [Express](https://expressjs.com/) is used as a benchmark to Polka.
- `Deno`: I am interessted how deno perfomes as well. Most popular choice seem to be [oak](https://github.com/oakserver/oak) http server
- `Python`: I used [Flask](https://flask.palletsprojects.com/en/1.1.x/) first and then [FastApi](https://github.com/tiangolo/fastapi) as it is marked as the fastest python library for api's.
- `dotnet core (C#)`: I need to further investigate approapriate approach and then create api. It would be great if someone with excellent knowledge of C# could contribute this api.

## What these load test results actually mean

Load tests of each solution give the `combined performance result` of

- the efficiency of used language (JavaScript, Python, Go, Rust)
- the efficiency of http library and the router (tls/https is not used)
- the efficiency of library used to communicate with PostgreSQL (db driver)
- how well all of this performs in the defined Docker containers (Linux Alpine or Debian)
- the efficiency of machine running these load tests

## Conclusion

I runned load tests on 3 machines (2 laptops and 1 desktop) for all api's. All results are saved in separate branches with the name of the machine (eg. dell-xps-2018...). There seem to be a differences in the ranking/score based on used hardware/machine. This is bit surprising to me. It means to me that different programming languages and maybe(?) libraries utilize specific hardware better. Again, it could be that my library knowledge is limited and has influence on the scores. As an example, see the image below where the performance of FastApi significanly improved (run 9+) after tweaking it for the number of workers used on this specific machine (dell-xps-2018). Fluctuations in actix-api are also due to experimenting with the number of used workers. Note that on my other machine a different number of workers yield the highest score.

The absolute scores per machine are different, of course, but `rust api using actix-web is clearly the fastest and python/flask api is the slowest on all tested machines`. NodeJS (polka, express), Deno (oak) and Golang api's (fiber and standard http/mux) are in the middle of the pack. Surprisingly Python FastAPI seem to be performing better than Golang api's after I optimized number of workers used. There might be some room to improve performance of Golang api's too but my knowledge of Golang at this moment is fairly limited.

The scores from my dell-xps-2018 machine are shown in the image bellow. An interactive version of this chart is avaliable on `http://localhost:3000` (NextJS app) after runing `npm run dev` in the tests folder.
<br/><br/>

<img src="todo-api-loadtest-dell-xps-200817.png">

<br/><br/>

# Development

This repo requires `docker and docker-compose` to run todo api's. For running load test and viewing simple table results you need `nodejs and npm`.

## How this repo works

Each todo* folder contains complete api solution. All api's are functionally identical. They perform simple CRUD operations on Postgres database (todo_db). Each api folder has readme file where you can read how to start the api and run load test.

1. install npm dependencies for load tests and test report webpage.

```bash
# go to tests folder
cd tests
# install dependencies
npm install
# go back to root
cd ../
```

2. run tests using test-round.sh bash script (`Linux/MacOS only`): this script will run one round of 30 sec. load tests for all api's. You should run at least 3-5 rounds to have more reliable results for your machine.

```bash
# run test-round shell script (linux/MacOS)
./test-round.sh
```

## Contribution

All contributions are more than welcome as I am interessted in bringing all of used techologies to maximum performace and increase my knowledge.

If you want to contribute the scores of your machine please do so. I can create new branch with your machine name. Based on my experience with running the api's on three different machines I expect that results on some other machines (and OS-es) could be quite different. This fact on its own will be quite interessting.
