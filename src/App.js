import {useState} from "react";

function Square({value, onSquareClick, isWinningSquare}) {
    const squareClassName = "square" + (isWinningSquare ? " winning-square" : "");

    return (
        <button className={squareClassName} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({xIsNext, squares, onPlay}) {
    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)) return

        const nextSquares = squares.slice()
        nextSquares[i] = xIsNext ? "X" : "O"

        onPlay(nextSquares)
    }

    const winner = calculateWinner(squares)
    let status
    if (winner) {
        status = "Winner: " + winner
    } else {
        status = "Next Player: " + (xIsNext ? "X" : "O")
    }

    const renderSquare = (i) => (
        <Square
            key={i}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
            isWinningSquare={winner && winner.includes(i)}
        />
    );

    const createBoardRow = (rowIndex) => (
        <div className="board-row" key={rowIndex}>
            {[0, 1, 2].map((colIndex) => renderSquare(rowIndex * 3 + colIndex))}
        </div>
    );

    return (
        <>
            <div className="status">{status}</div>
            {[0, 1, 2].map((rowIndex) => createBoardRow(rowIndex))}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)])
    const [currentMove, setCurrentMove] = useState(0)
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove]

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
        setHistory(nextHistory)
        setCurrentMove(nextHistory.length - 1)
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove)
    }

    const moves = history.map((square, move) => {
        let description
        if (move > 0) {
            description = 'Go to move #' + move
        } else {
            description = 'Go to game start'
        }

        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        )
    })

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    )
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
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i]
        }
    }
    return null
}
