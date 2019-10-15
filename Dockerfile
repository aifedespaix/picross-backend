FROM node:latest

COPY package.json /app/
WORKDIR /app
RUN npm install

RUN npm install -g --unsafe-perm prisma2
RUN npm install -g ts-node
