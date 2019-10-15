FROM node:latest

WORKDIR /home/node
COPY package.json .
RUN npm install
RUN npm install -g --unsafe-perm prisma2

ENTRYPOINT prisma2 dev
