# Use Node version 14
FROM node:14

# Create app directory within container
WORKDIR /usr

# Install app dependencies
# A wild card is used to ensure both package.json AND package-lock.json are copied 
COPY package*.json ./

COPY ./ ./
# COPY ./PersistantStorage ./PersistantStorage

# RUN npm install -g nodemon
RUN npm install

# EXPOSE 8080
EXPOSE 4000
EXPOSE 5002
CMD ["npm", "start"]