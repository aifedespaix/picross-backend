FROM node:latest

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .

RUN yarn prisma2 lift save --name 'init'
RUN yarn prisma2 lift up

RUN yarn generate

ENTRYPOINT yarn dev
