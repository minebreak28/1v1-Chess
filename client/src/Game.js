import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
    Button,
    Card,
    CardContent,
    ListSubheader,
    Stack,
    Tooltip,
    Typography,
    Box,
    Paper,
} from "@mui/material";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import CustomDialog from "./components/CustomDialog";
import socket from "./socket";
import "./css/main.css";

/**
 * Controls the entirety of the chess game
 * @param players players in the room
 * @param room room ID
 * @param orientation the orientation (w or b) of the current player
 * @param cleanup resets the state when a game is over
 * @param setStartOrJoinDialogOpen opens or closes the start/join room dialog box
 * @returns 
 */
function Game({ players, room, orientation, cleanup, setStartOrJoinDialogOpen }) {
    /** Memoized Chess instance for move validation and generation with caching */
    const chess = useMemo(() => new Chess(), []);
    /** set initial notation state*/
    const [fen, setFen] = useState(chess.fen());
    const [over, setOver] = useState("");
    const [context, setContext] = useState("");
    const [highlightSquares, setHighlightSquares] = useState({});
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");

    /**
     * Accepts a move and calls chess.move which validates the move object and updates the chess instance's internal state.
     * Next, set the Game component's FEN state to reflect that of the Chess instance.
     * After the move is made, check if it resulted in game over. If true, determine if checkmate or draw and update game's state accordingly.
     */
    const makeAMove = useCallback(

        (move) => {
            try {
                const result = chess.move(move); // update Chess instance
                setFen(chess.fen()); // update fen state to trigger a re-render

                console.log("over, checkmate", chess.isGameOver(), chess.isCheckmate());

                if (chess.isGameOver()) { // check if move led to "game over"
                    if (chess.isCheckmate()) { // if reason for game over is a checkmate
                        setOver("Game over!");
                        setContext(`${chess.turn() === "w" ? "Black" : "White"} wins by checkmate!`);
                    } else if (chess.isStalemate()) { // if it is a stalemate
                        setOver("Game over!");
                        setContext("The game ends in a stalemate.");
                    } else if (chess.isDraw()) { // if it is a draw
                        setOver("Game over!");
                        setContext("The game ends in a draw.");
                    } else { // This should never occur.
                        setOver("Game over!");
                        setContext(
                            "An error has occured."
                        );
                    }
                }
                return result;
            } catch (e) {
                return null; // null if the move was illegal, the move object if the move was legal
            }
        },
        [chess]
    );

    /** Handles piece movements
     *  @param sourceSquare initial piece position
     *  @param targetSquare target piece position
     */
    function onDrop(sourceSquare, targetSquare, piece) {
        // orientation is either 'white' or 'black'. game.turn() returns 'w' or 'b'
        if ((chess.turn() !== orientation[0]) || (players.length < 2)) return false; // prohibit player from moving piece of other player

        const moveData = {
            from: sourceSquare,
            to: targetSquare,
            color: chess.turn(),
            promotion: piece.slice(-1).toLowerCase()
        };

        const move = makeAMove(moveData);

        // illegal move
        if (move === null) return false;

        socket.emit("move", { // emit a move event.
            move,
            room,
        }); // this event will be transmitted to the opponent via the server

        return true;
    }

    // when client receives a move event, the move is validated and played using the makeAMove function
    useEffect(() => {
        socket.on("move", (move) => {
            makeAMove(move); //
        });
    }, [makeAMove]);


    useEffect(() => {
        // sends chat messages to the other player
        socket.on('chatMessage', (data) => {
            setChatMessages((prevMessages) => [...prevMessages, data]);
        });
        // if player disconnects, other player is notified
        socket.on('playerDisconnected', (player) => {
            setOver("You win due to opponent forfeit.")
            setContext(`${player.username} has disconnected`); // set game over
        });

        return () => {
            socket.off("chatMessage");
        };
    }, []);


    /** Handles the start of a piece drag
     *  @param piece piece being dragged
     *  @param sourceSquare initial piece position
     */
    function onDragStart(piece, sourceSquare) {
        const pieceColor = piece.charAt(0);
        const moves = chess.moves({ square: sourceSquare, verbose: true });
        const squaresToHighlight = {};
        moves.forEach(move => {
            if (chess.get(move.to)) { // Check if there's a piece on the target square
                squaresToHighlight[move.to] = {
                    backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 55%, rgba(128,128,128,0.5) 31%, rgba(128,128,128,0.5) 65%, transparent 31%)' //Indicate which pieces are able to be captured
                };
            } else {
                squaresToHighlight[move.to] = {
                    backgroundImage: 'radial-gradient(circle, rgba(128,128,128,0.5) 30%, transparent 31%)' //Indicate which positions are movable to
                };
            }
        });
        // Only highlight the board if the piece moved is the current player's
        if (pieceColor === orientation.charAt(0)) {
            setHighlightSquares(squaresToHighlight);
        } else {
            setHighlightSquares({});
        }
    }

    // Handles the end of a piece drag, simply removes highlights
    function onDragEnd() {
        setHighlightSquares({});
    }

    /**
     * Copies room id to clipboard
     */
    function copyToClipboard() {
        navigator.clipboard.writeText(room)
            .then(() => {
                setTooltipOpen(true);
                setTimeout(() => setTooltipOpen(false), 2000); // Hide the tooltip after 2 seconds
            })
    }

    // Handle sending a chat message
    const sendMessage = () => {
        if (chatInput.trim() !== "") {
            let senderUsername;
            if (orientation === 'white') {
                senderUsername = players[0]?.username + (players[0]?.id === socket.id ? " (You)" : "");
            } else {
                senderUsername = players[1]?.username + (players[1]?.id === socket.id ? " (You)" : "");
            }

            const newMessage = { username: senderUsername, message: chatInput };
            setChatMessages(prevMessages => [...prevMessages, newMessage]);
            socket.emit('chatMessage', { roomId: room, message: chatInput });
            setChatInput(""); // Clear the input field
        }
    };

    /**
     * Converts a chess piece abbreviation to its full name.
     * 
     * @param {string} abbreviation abbreviation of the chess piece.
     * @returns {string} full name of the chess piece corresponding to the abbreviation.
     */
    function pieceFullName(abbreviation) {
        switch (abbreviation) {
            case 'p':
                return 'pawn';
            case 'n':
                return 'knight';
            case 'b':
                return 'bishop';
            case 'r':
                return 'rook';
            case 'q':
                return 'queen';
            case 'k':
                return 'king';
            default:
                return abbreviation; // Return the abbreviation if no match found
        }
    }

    /**
     * Generates a description for a given chess move.
     * 
     * @param {object} move The move object containing details of the move.
     * @returns {string} A description of the move.
     */
    function getMoveDescription(move) {
        const { color, piece, from, to, captured, promotion, flags } = move;

        const fullPiece = pieceFullName(piece); // Get the full name of the piece

        switch (flags) {
            case 'n':
            case 'b':
                return `${color === 'w' ? 'White' : 'Black'} moved ${fullPiece} from ${from} to ${to}.`;
            case 'e':
            case 'c':
                return `${color === 'w' ? 'White' : 'Black'} moved ${fullPiece} from ${from} to ${to}, capturing opponent ${pieceFullName(captured)}.`;
            case 'np':
                return `${fullPiece} moved from ${from} to ${to}, promoting to ${pieceFullName(promotion)}.`;
            case 'k':
                return `${color === 'w' ? 'White' : 'Black'} performed kingside castling.`;
            case 'q':
                return `${color === 'w' ? 'White' : 'Black'} performed queenside castling.`;
            case 'cp':
                return `${color === 'w' ? 'White' : 'Black'} ${fullPiece} moved from ${from} to ${to}, capturing opponent ${pieceFullName(captured)} and promoting to ${pieceFullName(promotion)}.`;
            default:
                return `Invalid move, flag: ${flags}.`;
        }
    }


    // Game component returned jsx
    return (
        <Stack>
            <Card>
                <CardContent sx={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
                    {players.length === 0 ? (
                        <Typography variant="h5" sx={{ marginRight: '16px' }}>
                            Share the room ID with your friends to join as opponents
                        </Typography>
                    ) : (
                        <Typography variant="h5" sx={{ marginRight: '16px', display: 'flex', justifyContent: 'space-between' }}>
                            <>
                                <Typography variant="h5" sx={{ marginRight: '16px' }}>
                                    {orientation === 'white' ? players[0].username : players[1].username} (You)
                                </Typography>
                                <Typography variant="h5" sx={{ marginX: 'auto' }}>
                                    VS
                                </Typography>
                                <Typography variant="h5" sx={{ marginLeft: '16px' }}>
                                    {orientation === 'white' ? players[1].username : players[0].username} (Opponent)
                                </Typography>
                            </>
                        </Typography>
                    )}
                    {players.length === 0 && ( // Only render copy button if players.length is 0
                        <Tooltip
                            title="Copied!"
                            placement="right"
                            open={tooltipOpen}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<ContentCopyIcon />}
                                onClick={copyToClipboard}
                            >
                                Copy Room ID
                            </Button>
                        </Tooltip>
                    )}
                </CardContent>
            </Card>
            <Stack flexDirection="row" sx={{ pt: 2 }}>
                <Box className="board" style={{
                    maxWidth: 800,
                    maxHeight: 800,
                    flexGrow: 1,
                }}>
                    <Chessboard
                        position={fen}
                        onPieceDragBegin={onDragStart}
                        onPieceDragEnd={onDragEnd}
                        customSquareStyles={highlightSquares}
                        onPieceDrop={onDrop}
                        boardOrientation={orientation}
                    />
                </Box>
                <Stack class="statusContainer">
                    <Box>
                        {players.length > 1 ? (
                            <>
                                <div id="historyContainer">
                                    <ListSubheader sx={{ fontSize: '1.2rem', borderColor: 'blue' }}>Move History</ListSubheader>
                                    {chess.history().length === 0 ? (
                                        <ListSubheader>No moves made yet.</ListSubheader>
                                    ) : (
                                        /** Logs move history, with the newest move at the top */
                                        <Paper class="paper">
                                            {
                                                chess.history({ verbose: true }).reverse().map((move, index) => (
                                                    <Typography key={index} variant="body1">
                                                        {chess.history().length - index}. {getMoveDescription(move)}
                                                    </Typography>
                                                ))
                                            }
                                        </Paper>
                                    )}
                                </div>
                            </>
                        ) : (
                            <ListSubheader sx={{ fontSize: '1.5rem' }}>Waiting for opponent...</ListSubheader>
                        )}
                    </Box>
                    <Box>
                        {players.length > 1 ? (
                            <>
                                <div id="chat-box">
                                    <div id="messages">
                                        {chatMessages.slice(0).reverse().map((msg, index) => (
                                            <div key={index} className="message">
                                                <strong>{msg.username}: </strong>{msg.message}
                                            </div>
                                        ))}
                                    </div>
                                    <div id="input-container">
                                        <input
                                            type="text"
                                            id="user-input"
                                            placeholder="Type a message..."
                                            autoFocus
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') sendMessage();
                                            }}
                                        />
                                        <button id="send-button" onClick={sendMessage}>Send</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                            </>
                        )}
                    </Box>
                </Stack>
            </Stack>
            <CustomDialog // Game Over CustomDialog
                open={over}
                title={over}
                contentText={context}
                handleContinue={() => {
                    socket.emit("closeRoom", { roomId: room });
                    cleanup();
                    setStartOrJoinDialogOpen(true); // Show the button dialog when the game is over
                }}
            />
        </Stack >
    );
}
export default Game;
