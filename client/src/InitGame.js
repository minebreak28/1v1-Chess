import { Button, Stack, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState } from "react";
import socket from './socket';

export default function InitGame({ setRoom, setOrientation, setPlayers }) {
    const [roomDialogOpen, setRoomDialogOpen] = useState(false);
    const [roomInput, setRoomInput] = useState(''); // input state
    const [roomError, setRoomError] = useState('');

    // Function to handle closing the dialog
    const handleClose = () => {
        setRoomDialogOpen(false);
    };

    // Function to handle submitting room ID
    const handleContinue = () => {
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
            <Dialog
                open={roomDialogOpen}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                slotProps={{
                    backdrop: {
                        style: {
                            backgroundImage: "url('/chessbackground.jpg')",
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                        }
                    }
                }}
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
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleContinue}>Continue</Button>
                </DialogActions>
            </Dialog>

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
