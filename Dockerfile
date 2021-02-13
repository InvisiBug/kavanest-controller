# Use Node version 14
FROM node:15.8.0-alpine

# Create app directory within container
WORKDIR /usr/src/app

# Install app dependencies
# A wild card is used to ensure both package.json AND package-lock.json are copied 
COPY package*.json ./

COPY ./ ./
# COPY ./PersistantStorage ./PersistantStorage

RUN npm install --save-dev nodemon
# RUN npm install

# EXPOSE 8080
EXPOSE 4000
EXPOSE 5001
CMD npm start