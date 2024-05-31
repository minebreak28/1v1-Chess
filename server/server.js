const express = require('express');
const { Server } = require("socket.io");
const { v4: uuidV4 } = require('uuid');
const http = require('http');

const app = express(); // initialize express

const server = http.createServer(app); //HTTP server created


// set port to value received from environment variable or 8080 if null
const port = process.env.PORT || 8080

// upgrade http server to websocket server
const io = new Server(server, {
    cors: '*', // allow connection from any origin
});


// io.connection
io.on('connection', (socket) => {
    // socket refers to the client socket that just got connected.
    // each socket is assigned an id
    console.log(socket.id, 'connected');
    // listen to username event

    socket.on('username', (username) => {
        console.log('username:', username);
        socket.data.username = username;
    });
});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});