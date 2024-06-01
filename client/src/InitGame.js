import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import CustomDialog from "./components/CustomDialog";
import socket from './socket';


export default function InitGame({ setRoom, setOrientation, setPlayers }) {
    const [roomDialogOpen, setRoomDialogOpen] = useState(false); //boolean state that determines if the custom dialog should be rendered
    const [roomInput, setRoomInput] = useState(''); // contains the room ID the user has provided
    const [roomError, setRoomError] = useState(''); //keeps track of error encountered when joining room

    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ py: 1, height: "100vh" }}
        >
            <CustomDialog
                open={roomDialogOpen}
                handleClose={() => setRoomDialogOpen(false)}
                title="Select Room to Join"
                contentText="Enter a valid room ID to join the room"
                handleContinue={() => {
                    // join a room
                    if (!roomInput) return; // if given room input is valid, do nothing.
                    socket.emit("joinRoom", { roomId: roomInput }, (r) => {
                        // r is the response from the server
                        if (r.error) return setRoomError(r.message); // if an error is returned in the response set roomError to the error message and exit
                        console.log("response:", r);
                        setRoom(r?.roomId); // set room to the room ID
                        setPlayers(r?.players); // set players array to the array of players in the room
                        setOrientation("black"); // set orientation as black
                        setRoomDialogOpen(false); // close dialog
                    });
                }}
            >
                <TextField
                    autoFocus
                    margin="dense"
                    id="room"
                    label="Room ID"
                    name="room"
                    value={roomInput}
                    required
                    onChange={(e) => setRoomInput(e.target.value)}
                    type="text"
                    fullWidth
                    variant="standard"
                    error={Boolean(roomError)}
                    helperText={!roomError ? 'Enter a room ID' : `Invalid room ID: ${roomError}`}
                />
            </CustomDialog>
            {/* Button for starting a game */}
            <Button
                variant="contained"
                onClick={() => {
                    socket.emit("createRoom", (r) => {
                        console.log(r); // room ID
                        setRoom(r); //update room state
                        setOrientation("white"); // player who creates the room plays white
                    });
                }}
            >
                Start Game
            </Button>
            {/* Button for joining a game */}
            <Button
                onClick={() => {
                    setRoomDialogOpen(true)
                }}
            >
                Join Game
            </Button>
        </Stack>
    );
}