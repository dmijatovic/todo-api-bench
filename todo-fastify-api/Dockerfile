FROM node:12-buster-slim as build

WORKDIR /home/dv4all

COPY ./package*.json ./
RUN npm install

COPY . .
RUN npm run build

# node:12 on debian:10
FROM node:12-buster-slim

WORKDIR /home/dv4all

COPY --from=build /home/dv4all/dist .

CMD ["node","index.js"]
