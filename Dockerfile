FROM node:latest

COPY package.json /app/
WORKDIR /app

RUN yarn global add prisma2
RUN yarn global add tsc

RUN yarn

COPY . .

RUN prisma2 generate

ENTRYPOINT yarn dev
