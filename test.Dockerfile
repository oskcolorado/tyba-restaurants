FROM node:15-stretch

WORKDIR /usr/src/app/
COPY . .
RUN rm package-lock.json

RUN npm install