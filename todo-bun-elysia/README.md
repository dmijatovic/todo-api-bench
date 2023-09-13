# Elysia with Bun runtime

This project is created to learn using bun and elysia. The content will be used later to add it to my benchmark project.

## Getting Started

To get started with this template, simply paste this command into your terminal:

```bash
bun create elysia ./elysia-example
```

## Development

To start the development server run:

```bash
bun run dev
```

## Build

Bun support building of typescript solution.

```bash
# build 

# build executable
bun build src/index.ts --compile --minify --outfile build/app

```


Open http://localhost:3000/ with your browser to see the result.

## Remarks

Bun run --watch seem to be running also after using Ctrl+C. I am not sure how to stop process. There is another option --hot for hot reloading during development.

```bash
# list
netstat -tunap | grep LISTEN
```

## Docker images

I tried 3 versions:

- Dokcerfile_bun: not compiled image is 324MB
- Dockerfile_dist: compiled to single file is 277MB
- Dockerfile_distroless: compiled, minified and used in distroless is 120MB
