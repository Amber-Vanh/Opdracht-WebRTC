const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
server.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

io.on('connection', socket => {
    console.log('connection');
}); 