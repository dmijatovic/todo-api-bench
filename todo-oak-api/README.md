# Todo api with DENO and OAK

## Building

```bash
# run deno
deno run --allow-net --allow-read --allow-env ./src/main.ts

# build app in dist folder
# dist folder need to exist
deno bundle ./src/main.ts ./dist/api.bundle.js

# run build app
deno run --allow-net --allow-env dist/api.bundle.js
```

## Development

For development we use denon (nodemon look-a-like).

```bash
# install denon
deno install --allow-read --allow-run --allow-write --allow-net -f --unstable https://deno.land/x/denon@2.3.0/denon.ts

# use denon to restart
denon run --allow-net --allow-env ./src/main.ts

```
