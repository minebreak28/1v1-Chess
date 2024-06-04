import { Button, Stack, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState } from "react";
import socket from './socket';
import "./css/main.css";

export default function InitGame({ setRoom, setOrientation, setPlayers, startOrJoinDialogOpen, setStartOrJoinDialogOpen, roomDialogOpen, setRoomDialogOpen }) {
    const [roomInput, setRoomInput] = useState(''); // input state
    const [roomError, setRoomError] = useState('');

    // Function to handle closing the room dialog
    const handleRoomDialogClose = () => {
        setRoomDialogOpen(false);
        setStartOrJoinDialogOpen(true); // Reopen the start or join dialog
    };

    // Function to handle submitting room ID
    const handleRoomContinue = () => {
        if (!roomInput) return;
        socket.emit("joinRoom", { roomId: roomInput }, (r) => {
            if (r.error) return setRoomError(r.message);
            setRoom(r?.roomId);
            setPlayers(r?.players);
            setOrientation("black");
            setRoomDialogOpen(false);
        });
    };

    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={{
                py: 1,
                height: "100vh",
                "& .MuiDialog-root": {
                    "& .MuiDialog-paper": {
                        backgroundColor: 'transparent',
                    }
                }
            }}
        >
            {/* Room Dialog */}
            <Dialog
                open={roomDialogOpen}
                onClose={handleRoomDialogClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Select Room to Join</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a valid room ID to join the room
                    </DialogContentText>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRoomDialogClose}>Cancel</Button>
                    <Button onClick={handleRoomContinue}>Continue</Button>
                </DialogActions>
            </Dialog>

            {/* Start or Join Dialog */}
            <Dialog
                open={startOrJoinDialogOpen}
                onClose={() => setStartOrJoinDialogOpen(false)}
                sx={{ padding: "3" }}
            >
                <DialogTitle>Create or Join Game</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create a room or join existing room with code.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "space-around", margin: "0" }}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            socket.emit("createRoom", (r) => {
                                console.log(r);
                                setStartOrJoinDialogOpen(false);
                                setRoom(r);
                                setOrientation("white");
                            });
                        }}
                    >
                        Create Room
                    </Button>
                    <Button
                        onClick={() => {
                            setStartOrJoinDialogOpen(false);
                            setRoomDialogOpen(true)
                        }}
                    >
                        Join Room
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
