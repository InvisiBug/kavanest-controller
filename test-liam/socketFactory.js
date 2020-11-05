const http require('http');
const socketio require('socket.io');

const socketFactory = {
  createSocket: (app) => {
    const server = http.createServer(app)
    return socketio(server);
  }
};

module.exports = createSocket;