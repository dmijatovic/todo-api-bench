FROM hayd/debian-deno:1.2.1

WORKDIR /home/dv4all

# USER deno

ADD ./src .

RUN deno cache main.ts

RUN deno bundle main.ts api.bundle.js

CMD ["run","--allow-net","--allow-env", "api.bundle.js"]

