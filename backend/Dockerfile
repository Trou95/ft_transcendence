FROM node:20-bullseye-slim

RUN apt-get update

WORKDIR /usr/root/backend

COPY ./backend/ /usr/root/backend/

EXPOSE 3000

RUN npm i

RUN npm run build

ENTRYPOINT [ "npm", "run", "start:prod" ]
