FROM node:12-buster-slim as build

WORKDIR /home/dv4all

COPY ./package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:12-buster-slim

WORKDIR /home/dv4all

COPY --from=build /home/dv4all/dist .
COPY --from=build /home/dv4all/node_modules/nanoexpress/node_modules/uWebSockets.js/uws_linux_x64* ./

CMD ["node","index.js"]
