import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, sizeBoard, setLocations }) {

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

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
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
      <div className="status">{status}</div>
      {
        squareRows.map((row, rowIndex) => {
          return <div key={rowIndex} className="board-row">
            {
              squareRows.map((col, colIndex) => {
                const squareIndex = rowIndex * sizeBoard + colIndex;
                return <Square value={squares[squareIndex]} key={squareIndex}
                  onSquareClick={() => handleClick(squareIndex)} />
              })
            }
          </div>
        })
      }

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

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    console.log(locations);

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
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} sizeBoard={sizeBoard} setLocations={setLocations} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
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
      return squares[a];
    }
  }
  return null;


}
