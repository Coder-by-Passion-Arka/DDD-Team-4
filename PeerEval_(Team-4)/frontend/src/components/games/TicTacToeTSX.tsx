import React, { useState } from "react";

interface TicTacToeTSXProps {
  onBack: () => void;
  onComplete: (won: boolean, score: number) => void;
}

const TicTacToeTSX: React.FC<TicTacToeTSXProps> = ({ onBack, onComplete }) => {
  const initialGrid: ("" | "x" | "o")[] = Array(9).fill("");
  const [grid, setGrid] = useState(initialGrid);
  const [, setTurn] = useState<"x" | "o">("x");
  const [isLocked, setIsLocked] = useState(false);
  const [message, setMessage] = useState<string>("");

  const resetGame = () => {
    setGrid(initialGrid);
    setTurn("x");
    setIsLocked(false);
    setMessage("");
    for (let i = 0; i < 9; i++) {
      const cell = document.getElementById(`cell-${i}`);
      if (cell) cell.classList.remove("highlight");
    }
  };

  const highlightWin = (indexes: number[]) => {
    indexes.forEach((i) => {
      const cell = document.getElementById(`cell-${i}`);
      if (cell) cell.classList.add("highlight");
    });
  };

  const checkWin = (newGrid: ("" | "x" | "o")[], isPlayer: boolean) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (newGrid[a] && newGrid[a] === newGrid[b] && newGrid[b] === newGrid[c]) {
        highlightWin(pattern);
        setIsLocked(true);
        setTimeout(() => {
          setMessage(isPlayer ? "You win!" : "You lose!");
          onComplete && onComplete(isPlayer, isPlayer ? 100 : 0);
        }, 200);
        return true;
      }
    }

    if (newGrid.every((cell) => cell !== "")) {
      setIsLocked(true);
      setTimeout(() => {
        setMessage("It's a draw!");
        onComplete && onComplete(false, 0);
      }, 200);
      return true;
    }

    return false;
  };

  const computerMove = (updatedGrid: ("" | "x" | "o")[]) => {
    if (isLocked) return;
    const emptyIndexes = updatedGrid.map((v, i) => (v === "" ? i : null)).filter(i => i !== null) as number[];
    if (emptyIndexes.length === 0) return;
    const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    updatedGrid[randomIndex] = "o";
    setGrid(updatedGrid);
    checkWin(updatedGrid, false);
  };

  const handleClick = (idx: number) => {
    if (isLocked || grid[idx] !== "") return;
    const newGrid = [...grid];
    newGrid[idx] = "x";
    setGrid(newGrid);
    const playerWon = checkWin(newGrid, true);
    if (!playerWon) {
      setTimeout(() => computerMove([...newGrid]), 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Tic Tac Toe</h1>
      <div className="grid grid-cols-3 gap-4">
        {grid.map((value, idx) => (
          <div
            key={idx}
            id={`cell-${idx}`}
            className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-700 hover:bg-blue-600 text-white text-5xl sm:text-6xl flex items-center justify-center rounded-lg cursor-pointer shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={() => handleClick(idx)}
          >
            {value === "x" && "✖"}
            {value === "o" && "◯"}
          </div>
        ))}
      </div>
      {message && (
        <div className="mt-6 text-2xl font-semibold text-amber-300 animate-pulse">{message}</div>
      )}
      <button
        onClick={resetGame}
        className="mt-6 px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 rounded-full text-white text-lg shadow-lg transition-all"
      >
        Restart Game
      </button>
      <button
        onClick={onBack}
        className="mt-4 px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-full text-white text-lg shadow-lg transition-all"
      >
        Back to Games
      </button>
    </div>
  );
};

export default TicTacToeTSX;