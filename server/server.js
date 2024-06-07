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

    // username is submitted
    socket.on('username', (username) => {
        console.log(username);
        socket.data.username = username;
    });

    // room is created
    socket.on('createRoom', async (callback) => { // callback here refers to the callback function from the client passed as data
        const roomId = uuidV4(); //creates new UID
        await socket.join(roomId); //user who created the room, joins the room

        // set roomId as a key and roomData including players as value in the map
        rooms.set(roomId, {
            roomId,
            players: [{ id: socket.id, username: socket.data?.username }]
        });

        callback(roomId); //respond with roomId to client by calling the callback function from the client
    });

    /**
     * Adds validation to confirm room ID
     * If valid, joining player is added to the room and notify other player game is ready to begin
     * If invalid, respond with error message
    */
    socket.on('joinRoom', async (args, callback) => {
        // check if room exists and has a player waiting
        const room = rooms.get(args.roomId);
        let error, message;

        if (!room) { // if room does not exist
            error = true;
            message = 'Room does not exist';
        } else if (room.players.length <= 0) { // if room is empty set appropriate message
            error = true;
            message = 'Room is empty';
        } else if (room.players.length >= 2) { // if room is full
            error = true;
            message = 'Room is full'; // set message to 'room is full'
        }

        if (error) {
            if (callback) { // if user passed a callback, call it with an error payload
                callback({
                    error,
                    message
                });
            }

            return; // exit
        }

        await socket.join(args.roomId); // make the joining client join the room

        // add the joining user's data to the list of players in the room
        const roomUpdate = {
            ...room,
            players: [
                ...room.players,
                { id: socket.id, username: socket.data?.username },
            ],
        };

        rooms.set(args.roomId, roomUpdate);

        callback(roomUpdate); // respond to the client with the room details

        // emit an 'opponentJoined' event to the room to tell the other player that an opponent has joined
        socket.to(args.roomId).emit('opponentJoined', roomUpdate);
    });

    // player makes a move
    socket.on('move', (data) => {
        // emit to all sockets in the room except the emitting socket.
        socket.to(data.room).emit('move', data.move);
    });

    // room is closed
    socket.on("closeRoom", async (data) => {
        socket.to(data.roomId).emit("closeRoom", data); //inform others in the room that the room is closing

        const clientSockets = await io.in(data.roomId).fetchSockets(); //get all sockets in a room

        // loop over each socket client
        clientSockets.forEach((s) => {
            s.leave(data.roomId); //make them leave the room on socket.io
        });

        rooms.delete(data.roomId); //delete room from rooms map
    });

    // message is sent in chat
    socket.on('chatMessage', (data) => {
        // Broadcast the chat message to everyone in the room
        socket.to(data.roomId).emit('chatMessage', {
            username: socket.data.username,
            message: data.message,
        });
    });

    // player is disconnected
    socket.on("disconnect", () => {
        const gameRooms = Array.from(rooms.values()); // list of available rooms

        gameRooms.forEach((room) => { // <- 2
            const userInRoom = room.players.find((player) => player.id === socket.id); // <- 3

            if (userInRoom) {
                if (room.players.length < 2) {
                    // if there's only 1 player in the room, close room and exit
                    rooms.delete(room.roomId);
                    return;
                }

                socket.to(room.roomId).emit("playerDisconnected", userInRoom); // <- 4
            }
        });
    });

});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});