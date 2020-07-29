FROM hayd/debian-deno:1.0.0

WORKDIR /home/dv4all

USER deno

COPY deps.ts .

RUN deno cache deps.ts

