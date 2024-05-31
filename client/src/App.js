import { useState } from "react";
import { Container, TextField } from "@mui/material";
import Game from "./Game";
import socket from './socket';
import CustomDialog from "./components/CustomDialog";

export default function App() {
  const [username, setUsername] = useState('');

  // indicates if a username has been submitted
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);

  return (
    <Container>
      <CustomDialog
        open={!usernameSubmitted} // leave open if username has not been selected
        title="Pick a username" // Title of dialog
        contentText="Please select a username" // content text of dialog
        handleContinue={() => { // fired when continue is clicked
          if (!username) return; // if username hasn't been entered, do nothing
          socket.emit("username", username); // emit a websocket event called "username" with the username as data
          setUsernameSubmitted(true); // indicate that username has been submitted
        }}
      >
        <TextField // Input
          autoFocus // automatically set focus on input (make it active).
          margin="dense"
          id="username"
          label="Username"
          name="username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)} // update username state with value
          type="text"
          fullWidth
          variant="standard"
        />
      </CustomDialog>
      <Game />
    </Container>
  );
}