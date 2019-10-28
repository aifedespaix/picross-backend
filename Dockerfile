FROM node:latest

WORKDIR /app

COPY . .

RUN node -v
#COPY package.json .
#COPY yarn.lock .
#COPY .env .
RUN yarn

RUN yarn prisma2 lift save --name 'init'
RUN yarn prisma2 lift up

RUN yarn generate
RUN yarn build

ENTRYPOINT yarn start
