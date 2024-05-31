import { useState, useMemo, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import CustomDialog from "./components/CustomDialog";

function Game({ players, room, orientation, cleanup }) {
    /** Memoized Chess instance for move validation and generation with caching */
    const chess = useMemo(() => new Chess(), []);
    /** set initial notation state*/
    const [fen, setFen] = useState(chess.fen());
    const [over, setOver] = useState("");
    const [highlightSquares, setHighlightSquares] = useState({});

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
                        // Set message to checkmate. 
                        setOver(
                            `Checkmate! ${chess.turn() === "w" ? "Black" : "White"} wins!`
                        );
                        // The winner is determined by checking which side made the last move
                    } else if (chess.isDraw()) { // if it is a draw
                        setOver("Draw"); // set message to "Draw"
                    } else {
                        setOver("Game over");
                    }
                }

                return result;
            } catch (e) {
                return null;
            } // null if the move was illegal, the move object if the move was legal
        },
        [chess]
    );

    /** Handles piece movements
     *  @param sourceSquare initial piece position
     *  @param targetSquare target piece position
     */
    function onDrop(sourceSquare, targetSquare) {
        const moveData = {
            from: sourceSquare,
            to: targetSquare,
            color: chess.turn(), // returns current player's color
            // promotion: "q",
        };

        const move = makeAMove(moveData);

        // illegal move
        if (move === null) return false;

        setHighlightSquares({}); // Clear highlights after move

        return true;
    }

    /** Handles the start of a piece drag
     *  @param piece piece being dragged
     *  @param sourceSquare initial piece position
     */
    function onDragStart(piece, sourceSquare) {
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

        setHighlightSquares(squaresToHighlight);
    }

    /** Handles the end of a piece drag, simply removes highlights
     *  @param piece piece being dragged
     *  @param sourceSquare initial piece position
     *  @param targetSquare target piece position
     *  @param didMove boolean indicating if the piece moved
     */
    function onDragEnd(piece, sourceSquare, targetSquare, didMove) {
        setHighlightSquares({});
    }

    // Game component returned jsx
    return (
        <>
            <div className="board">
                <Chessboard
                    position={fen}
                    onPieceDrop={onDrop}
                    onPieceDragBegin={onDragStart}
                    onPieceDragEnd={onDragEnd}
                    customSquareStyles={highlightSquares}
                />
            </div>
            <CustomDialog
                open={Boolean(over)}
                title={over}
                contentText={over}
                handleContinue={() => {
                    setOver("");
                }}
            />
        </>
    );
}

export default Game;
