const express = require('express');
const MessageReceiver = require('./MessageReceiver');

const {createSocket} = require("./socketFactory");

const app = () => {
  const app = express();
  const socket = createSocket(app);

  const receiver = new MessageReceiver(socket);

  receiver.doSomeStuff();
}

module.exports = app;