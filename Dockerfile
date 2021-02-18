FROM node:latest
WORKDIR /app
ADD .. /app
RUN npm install
CMD server.js
