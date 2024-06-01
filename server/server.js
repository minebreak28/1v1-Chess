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

const rooms = new Map();

// io.connection
io.on('connection', (socket) => {
    console.log(socket.id, 'connected');

    // socket.on('username')
    socket.on('username', (username) => {
        console.log(username);
        socket.data.username = username;
    });

    socket.on('createRoom', async (callback) => { // callback here refers to the callback function from the client passed as data
        const roomId = uuidV4(); //creates new UID
        await socket.join(roomId); //user who created the room, joins the room

        // set roomId as a key and roomData including players as value in the map
        rooms.set(roomId, {
            roomId,
            players: [{ id: socket.id, username: socket.data?.username }]
        });
        // returns Map(1){'2b5b51a9-707b-42d6-9da8-dc19f863c0d0' => [{id: 'socketid', username: 'username1'}]}

        callback(roomId); //respond with roomId to client by calling the callback function from the client
    });
});