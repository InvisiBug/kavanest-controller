# Use Node version 14
FROM node:14
# FROM node:15.8.0-alpine

# Create app directory within container
# Allways use this pattern
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Copy everything apart from doker ignore across
COPY ./ ./

RUN npm install -g nodemon
RUN npm install

# EXPOSE 8080
EXPOSE 4000
EXPOSE 5001
CMD ["npm", "start"]