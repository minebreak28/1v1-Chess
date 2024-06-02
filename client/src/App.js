import { useEffect, useState, useCallback } from "react";
import Container from "@mui/material/Container";
import Game from "./Game";
import InitGame from "./InitGame";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Backdrop } from "@mui/material";
import socket from "./socket";

export default function App() {
  const [username, setUsername] = useState("");
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [room, setRoom] = useState(""); // stores current room ID
  const [orientation, setOrientation] = useState(""); // stores board orientation for user
  const [players, setPlayers] = useState([]); // stores players in room
  const [showUsernameDialog, setShowUsernameDialog] = useState(true); // controls the visibility of the username dialog
  const [startOrJoinDialogOpen, setStartOrJoinDialogOpen] = useState(false); // controls the visibility of start or join dialog
  const [roomDialogOpen, setRoomDialogOpen] = useState(false); // controls the visibility of room dialog

  // resets the states responsible for initializing a game
  const cleanup = useCallback(() => {
    setRoom("");
    setOrientation("");
    setPlayers([]);
  }, []);

  useEffect(() => {
    socket.on("opponentJoined", (roomData) => {
      console.log("roomData", roomData)
      setPlayers(roomData.players);
    });
  }, []);

  // Function to handle closing the username dialog
  const handleUsernameDialogClose = () => {
    setUsernameSubmitted(true);
    setShowUsernameDialog(false);
    setStartOrJoinDialogOpen(true); // Open the start or join dialog after username is submitted
  };

  // Function to handle submitting username
  const handleUsernameContinue = () => {
    if (!username) return;
    socket.emit("username", username);
    setUsernameSubmitted(true);
    setShowUsernameDialog(false);
    setStartOrJoinDialogOpen(true); // Open the start or join dialog after username is submitted
  };

  return (
    <Container>
      {/* Backdrop */}
      <Backdrop open={showUsernameDialog || startOrJoinDialogOpen || roomDialogOpen} sx={{
        backgroundImage: "url('/chessbackground.jpg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#000000',
        backgroundPosition: 'center',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }} />

      {/* Username Dialog */}
      <Dialog open={showUsernameDialog}>
        <DialogTitle sx={{ textAlign: 'center' }}>1v1 Chess</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you prepared to face your friends in an epic chess showdown? Reveal your name, brave challenger!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Name"
            name="username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUsernameContinue}>Continue</Button>
        </DialogActions>
      </Dialog>

      {/* Game component or InitGame component based on conditions */}
      {room ? (
        <Game
          room={room}
          orientation={orientation}
          username={username}
          players={players}
          cleanup={cleanup} // cleans up state when game is over
          setStartOrJoinDialogOpen={setStartOrJoinDialogOpen} // Pass the function to Game component
        />
      ) : (
        <InitGame
          setRoom={setRoom}
          setOrientation={setOrientation}
          setPlayers={setPlayers}
          startOrJoinDialogOpen={startOrJoinDialogOpen}
          setStartOrJoinDialogOpen={setStartOrJoinDialogOpen}
          roomDialogOpen={roomDialogOpen}
          setRoomDialogOpen={setRoomDialogOpen}
        />
      )}
    </Container>
  );
}
