FROM hayd/debian-deno:1.2.1

WORKDIR /home/dv4all

USER deno

ADD ./src .

RUN deno cache main.ts && deno bundle main.ts api.bundle.js

CMD ["run","--allow-net","--alow-env", "api.bindle.js"]

