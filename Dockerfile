FROM node:latest

WORKDIR /app

RUN node -v
COPY package.json .
COPY yarn.lock .
COPY .env .
RUN yarn

COPY . .

RUN yarn prisma2 lift save --name 'init'
RUN yarn prisma2 lift up

RUN yarn generate
RUN yarn build

ENTRYPOINT yarn start
