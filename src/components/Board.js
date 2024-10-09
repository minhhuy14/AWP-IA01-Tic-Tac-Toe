import Square from "./Square";
import { calculateWinner } from "../components/Game";
function Board({ xIsNext, squares, onPlay, sizeBoard, setLocations, isDrawGame }) {

    function handleClick(i) {

        if (calculateWinner(squares) || squares[i]) {
            return;
        };

        let location = convertTo2DCoordinate(i, sizeBoard);
        setLocations(current => [...current, location]);

        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares);

    }

    const gameResult = calculateWinner(squares);
    let lineWinner = null;
    let status;
    if (gameResult) {
        status = 'Winner: ' + gameResult?.winner;
        lineWinner = gameResult?.result;
    } else if (isDrawGame) {
        status = 'Draw!';
    }
    else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    const squareRows = Array(sizeBoard).fill(null);

    function convertTo2DCoordinate(value, sizeBoard) {
        return [
            Math.floor(value / sizeBoard),
            value % sizeBoard
        ]

    }
    function calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return {
                    winner: squares[a],
                    result: lines[i]
                }
            }
        }

        return null;
    }
    return (
        <>
            <div className={status === 'Draw!' || status.startsWith('Winner') ? 'status final-status' : 'status'}>{status}</div>
            {squareRows.map((row, rowIndex) => (
                <div key={rowIndex} className="board-row">
                    {squareRows.map((col, colIndex) => {
                        const squareIndex = rowIndex * sizeBoard + colIndex;
                        const isWinnerSquare = lineWinner && lineWinner.includes(squareIndex);
                        return (
                            <Square
                                value={squares[squareIndex]}
                                key={squareIndex}
                                onSquareClick={() => handleClick(squareIndex)}
                                isWinner={isWinnerSquare}
                            />
                        );
                    })}
                </div>
            ))}
        </>
    );
}

export default Board;