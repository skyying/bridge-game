FROM node:8-alpine

COPY . /app
WORKDIR /app
RUN npm install
RUN npm install forever -g

CMD npm start
