import { useEffect, useState, useCallback } from "react";
import Container from "@mui/material/Container";
import Game from "./Game";
import InitGame from "./InitGame";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import socket from "./socket";

export default function App() {
  const [username, setUsername] = useState("");
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [room, setRoom] = useState(""); // stores current room ID
  const [orientation, setOrientation] = useState(""); // stores board orientation for user
  const [players, setPlayers] = useState([]); // stores players in room
  const [showDialog, setShowDialog] = useState(!usernameSubmitted); // determines whether to show the dialog

  // resets the states responsible for initializing a game
  const cleanup = useCallback(() => {
    setRoom("");
    setOrientation("");
    setPlayers("");
  }, []);

  useEffect(() => {
    socket.on("opponentJoined", (roomData) => {
      console.log("roomData", roomData)
      setPlayers(roomData.players);
    });
  }, []);

  // Function to handle closing the dialog
  const handleClose = () => {
    setUsernameSubmitted(true);
    setShowDialog(false);
  };

  // Function to handle submitting username
  const handleContinue = () => {
    if (!username) return;
    socket.emit("username", username);
    setUsernameSubmitted(true);
    setShowDialog(false);
  };

  return (
    <Container>
      {/* Dialog container */}
      <Dialog
        open={showDialog}
        slotProps={{
          backdrop: {
            style: {
              backgroundImage: "url('/chessbackground.jpg')",
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#000000',
              backgroundPosition: 'center'
            }
          }
        }}
      >
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
          {/* <Button onClick={handleClose}>Cancel</Button> */}
          <Button onClick={handleContinue}>Continue</Button>
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
        />
      ) : (
        <InitGame
          setRoom={setRoom}
          setOrientation={setOrientation}
          setPlayers={setPlayers}
        />
      )}
    </Container>
  );
}
