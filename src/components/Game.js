import Board from "./Board";
import { useState } from "react";

function Game() {

    const [sizeBoard, setSizeBoard] = useState(3);
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    const [locations, setLocations] = useState([]);

    const [sortAscending, setSortAscending] = useState(true);

    const [isDrawGame, setIsDrawGame] = useState(false);
    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        console.log(locations);
        let checkDrawGame = nextSquares.every((value) => value !== null && (value === 'X' || value === 'O'));
        if (checkDrawGame === true) {
            setIsDrawGame(true);
        }

    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }


    const moves = history.map((squares, move) => {
        let description;
        if (move == 0) {
            description = 'Go to game start';
        }
        else if (move > 0 && move == currentMove) {
            description = `You are at move #${move}: (${locations[move - 1]})`;
        }
        else if (move > 0) {
            description = `Go to move #${move}: (${locations[move - 1]})`;
        }


        return (
            <li key={move}>
                {move === currentMove ? (
                    <span>{description}</span>
                ) : (
                    <button onClick={() => jumpTo(move)}>{description}</button>
                )}
            </li>

        )
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} sizeBoard={sizeBoard} setLocations={setLocations} isDrawGame={isDrawGame} />
            </div>
            <div className="game-info">
                <button onClick={() => setSortAscending(!sortAscending)}>Sort the moves {sortAscending ? 'descending' : 'ascending'}</button>
                <ol style={{
                    display: 'flex',
                    flexDirection: sortAscending ? 'column' : 'column-reverse'
                }}>
                    {moves}
                </ol>
            </div>
        </div>
    );
}


export default Game;