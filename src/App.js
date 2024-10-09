import { useState } from 'react';

function Square({ value, onSquareClick, isWinner }) {
  return (
    <button className={isWinner ? "square square-winner" : "square"} onClick={onSquareClick}>
      {value}
    </button >
  );
}

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
    status = 'Game Draw';
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

  return (
    <>
      <div className={status === 'Game Draw' || status.startsWith('Winner') ? 'status final-status' : 'status'}>{status}</div>
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

export default function Game() {

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
