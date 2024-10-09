function Square({ value, onSquareClick, isWinner }) {
    return (
        <button className={isWinner ? "square square-winner" : "square"} onClick={onSquareClick}>
            {value}
        </button >
    );
}

export default Square;
