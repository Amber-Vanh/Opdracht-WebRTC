const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8080;
const fs = require('fs');
const options = {
  key: fs.readFileSync('./localhost.key'),
  cert: fs.readFileSync('./localhost.crt')
};
const server = require('https').Server(options, app);


app.use(express.static('public'));
app.use('/node_modules', express.static('node_modules'));
server.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

const io = require('socket.io')(server);

const clients = {};
const senderToDesktop = {};

// socket event handlers
const handleConnection = (socket) => {
  clients[socket.id] = { id: socket.id };
  console.log(`Client connected: ${socket.id}`);
};

const handleDisconnect = (socket) => {
  const connectedDesktopId = senderToDesktop[socket.id];
  if (connectedDesktopId) {
    io.to(connectedDesktopId).emit('peerDisconnected', socket.id);
    delete senderToDesktop[socket.id];
  }

  Object.keys(senderToDesktop).forEach(senderId => {
    if (senderToDesktop[senderId] === socket.id) {
      delete senderToDesktop[senderId];
    }
  });

  delete clients[socket.id];
  console.log(`Client disconnected: ${socket.id}`);
};

const handleSignal = (socket, peerId, signal) => {
  console.log(`Signal from ${socket.id} to ${peerId}`);
  io.to(peerId).emit('signal', peerId, signal, socket.id);
};

const handlePeerReady = (socket, peerId) => {
  console.log(`Peer ${socket.id} is ready for ${peerId}`);
  senderToDesktop[socket.id] = peerId;
  io.to(peerId).emit('peerReady', socket.id);
};

// Socket connection
io.on('connection', socket => {
  handleConnection(socket);

  socket.on('disconnect', () => handleDisconnect(socket));
  socket.on('signal', (peerId, signal) => handleSignal(socket, peerId, signal));
  socket.on('peerReady', peerId => handlePeerReady(socket, peerId));
});