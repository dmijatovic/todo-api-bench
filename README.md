# Todo API tests

Testing techologies and learning to use them.

For a long time I was primarily  relaying on nodejs and express to serve data to my frontends. Over the time I learned about number of other alternatives my clients use. I have a feeling that there are some chages in the landscape of used/preffered technologies. I focus on the open source stack, I might also look into Microsoft dotnet core as it is open source tough my knowledge of C# is very limited. I see a number of interessting alternatives to nodejs/express stack to use anno 2020. As I was viewing lot of banchmarks lately I also got an idea to perform some load tests on each of the solutions I consider attractive.

So, I created this repo to learn new technologies and test their performance. The api servers are important part of backend solition. Other important part are databases. To limit the variations I will initially use PostreSQL in all api solutions because it is well supported in all technologies I want to learn/test. Only with dotnet core I am thinking about using MSSQL. We will see :-).

## Used technologies

I plan to test following technologies:

- Golang: There are multiple http servers I want to test from golang. Basic net/http and mux server and fiber which seem to be fast and kind-a-express-way.
- Rust: I started with actix http server which seem to be popular for rust.
- NodeJS: I want to try polka server. It seems to be one of the fastest nodejs http servers
- Deno: I am interessted how deno perfomes as weel. Most popular choice seem to be oak http server
- Python/Flask: I will use Flask first and then try some other solutions.
- dotnet core (C#): I need to more investigate what is approapriate in this case

## Requirements

This repo requires `docker and docker-compose` to run the api. For running load test and seeing simple table results you need `nodejs`.

## How this repo works

Each folder contains api solition. All api are basically the same. They resemble a simple todo api and support basic CRUD operations. In each api folder you will find readme file where you can read how you can start the api. The intention is that each api can be started with a simple `docker-compose up` command.
