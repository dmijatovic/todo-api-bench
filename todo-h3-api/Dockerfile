FROM node:20-slim as build

WORKDIR /api

COPY ./package*.json ./
RUN npm install

COPY . .
RUN npm run build

# node:16 on debian:10
FROM node:20-slim

WORKDIR /api

COPY --from=build /api/dist .

CMD ["node","index.js"]
