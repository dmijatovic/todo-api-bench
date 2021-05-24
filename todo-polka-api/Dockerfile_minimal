FROM node:12-alpine3.12 as build

WORKDIR /home/dv4all

COPY ./package*.json ./

RUN npm install

COPY . .

# RUN npm test
RUN npm run build

FROM alpine:3.12

WORKDIR /home/dv4all

RUN apk add --no-cache nodejs

COPY --from=build /home/dv4all/dist .

# EXPOSE 5433
EXPOSE 5432

CMD ["node","index.js"]



