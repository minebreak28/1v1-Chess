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
                        console.log(r);
                        setRoom(r);
                        setOrientation("white");
                    });
                }}
            >
                Start a game
            </Button>
            {/* Button for joining a game */}
            <Button
                onClick={() => {
                    setRoomDialogOpen(true)
                }}
            >
                Join a game
            </Button>
        </Stack>
    );
}