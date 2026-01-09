import React, { useMemo, useState } from "react";
import "./App.css";

/**
 * Returns the winning line (indices) if there is a winner; otherwise null.
 * @param {(string|null)[]} squares
 * @returns {{winner: 'X'|'O', line: number[]} | null}
 */
function getWinner(squares) {
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

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) {
      return { winner: v, line: [a, b, c] };
    }
  }
  return null;
}

/**
 * @param {(string|null)[]} squares
 * @returns {boolean}
 */
function isDraw(squares) {
  return squares.every((s) => s !== null);
}

function Square({ value, onClick, highlight, disabled }) {
  return (
    <button
      type="button"
      className={`square ${highlight ? "square--highlight" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Square ${value}` : "Empty square"}
    >
      {value}
    </button>
  );
}

export default function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const win = useMemo(() => getWinner(squares), [squares]);
  const draw = useMemo(() => !win && isDraw(squares), [win, squares]);

  const status = useMemo(() => {
    if (win) return `Winner: ${win.winner}`;
    if (draw) return "Draw!";
    return `Next turn: ${xIsNext ? "X" : "O"}`;
  }, [win, draw, xIsNext]);

  function handlePlay(i) {
    if (win || squares[i] !== null) return;

    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext((v) => !v);
  }

  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  const disabled = Boolean(win || draw);

  return (
    <div className="page">
      <main className="card">
        <header className="header">
          <div>
            <h1 className="title">Tic Tac Toe</h1>
            <p className="subtitle">Play locally — two players, one device.</p>
          </div>

          <button type="button" className="btn" onClick={handleRestart}>
            Restart
          </button>
        </header>

        <section className="status" aria-live="polite">
          <span className={`badge ${win ? "badge--win" : draw ? "badge--draw" : ""}`}>
            {status}
          </span>
        </section>

        <section className="board" role="grid" aria-label="Tic Tac Toe board">
          {squares.map((value, i) => (
            <Square
              key={i}
              value={value}
              highlight={Boolean(win?.line?.includes(i))}
              disabled={disabled || value !== null}
              onClick={() => handlePlay(i)}
            />
          ))}
        </section>

        <footer className="footer">
          <div className="legend">
            <span className="legend__item">
              <span className="dot dot--x" aria-hidden="true" />X
            </span>
            <span className="legend__item">
              <span className="dot dot--o" aria-hidden="true" />O
            </span>
          </div>

          <small className="meta">
            {process.env.REACT_APP_NODE_ENV ? `env: ${process.env.REACT_APP_NODE_ENV}` : ""}
          </small>
        </footer>
      </main>
    </div>
  );
}
