import { io } from "socket.io-client"; // import connection function

const socket = io(); // initialize websocket connection on port 8080

export default socket;