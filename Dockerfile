FROM node:latest
WORKDIR /usr/src/app
ADD package*.json ./
RUN npm install
ADD . /usr/src/app
EXPOSE 3000
CMD ["npm","start"]
