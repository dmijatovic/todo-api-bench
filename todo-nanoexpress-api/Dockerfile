FROM node:14-alpine

WORKDIR /home/dv4all

COPY ./package*.json ./

RUN npm install

COPY . .

RUN ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2

CMD ["npm","start"]
