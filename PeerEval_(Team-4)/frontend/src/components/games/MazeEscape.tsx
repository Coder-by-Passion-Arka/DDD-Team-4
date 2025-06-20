
import React, { useEffect, useRef, useState } from "react";

const mazeRows = 10;
const mazeCols = 10;
const cellSize = 40;

interface Cell {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  visited: boolean;
}

interface Position {
  x: number;
  y: number;
}

const generateMaze = (): Cell[][] => {
  const maze: Cell[][] = Array.from({ length: mazeRows }, () =>
    Array.from({ length: mazeCols }, () => ({
      top: true,
      right: true,
      bottom: true,
      left: true,
      visited: false,
    }))
  );

  const stack: Position[] = [];
  const start: Position = { x: 0, y: 0 };
  maze[start.y][start.x].visited = true;
  stack.push(start);

  const directions = [
    { dx: 0, dy: -1, dir: "top", opp: "bottom" },
    { dx: 1, dy: 0, dir: "right", opp: "left" },
    { dx: 0, dy: 1, dir: "bottom", opp: "top" },
    { dx: -1, dy: 0, dir: "left", opp: "right" },
  ];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const { x, y } = current;
    const neighbors = directions
      .map(({ dx, dy, dir, opp }) => {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          nx < mazeCols &&
          ny >= 0 &&
          ny < mazeRows &&
          !maze[ny][nx].visited
        ) {
          return { nx, ny, dir, opp };
        }
        return null;
      })
      .filter(Boolean);

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)]!;
      maze[y][x][next.dir as keyof Cell] = false;
      maze[next.ny][next.nx][next.opp as keyof Cell] = false;
      maze[next.ny][next.nx].visited = true;
      stack.push({ x: next.nx, y: next.ny });
    } else {
      stack.pop();
    }
  }

  return maze;
};

const MazeEscape: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [maze, setMaze] = useState<Cell[][]>(generateMaze());
  const [player, setPlayer] = useState<Position>({ x: 0, y: 0 });
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    drawMaze();
  }, [player, maze]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => handleMove(e.key);
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const drawMaze = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, mazeCols * cellSize, mazeRows * cellSize);

    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        if (cell.top) {
          ctx.beginPath();
          ctx.moveTo(x * cellSize, y * cellSize);
          ctx.lineTo((x + 1) * cellSize, y * cellSize);
          ctx.stroke();
        }
        if (cell.right) {
          ctx.beginPath();
          ctx.moveTo((x + 1) * cellSize, y * cellSize);
          ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
          ctx.stroke();
        }
        if (cell.bottom) {
          ctx.beginPath();
          ctx.moveTo(x * cellSize, (y + 1) * cellSize);
          ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
          ctx.stroke();
        }
        if (cell.left) {
          ctx.beginPath();
          ctx.moveTo(x * cellSize, y * cellSize);
          ctx.lineTo(x * cellSize, (y + 1) * cellSize);
          ctx.stroke();
        }
      });
    });

    ctx.fillStyle = "#4ade80";
    ctx.fillRect(
      player.x * cellSize + 5,
      player.y * cellSize + 5,
      cellSize - 10,
      cellSize - 10
    );

    ctx.fillStyle = "#facc15";
    ctx.fillRect(
      (mazeCols - 1) * cellSize + 10,
      (mazeRows - 1) * cellSize + 10,
      cellSize - 20,
      cellSize - 20
    );
  };

  const handleMove = (direction: string) => {
    if (gameWon) return;
    const { x, y } = player;
    const cell = maze[y][x];
    let newX = x;
    let newY = y;

    if ((direction === "ArrowUp" || direction === "up") && !cell.top) newY--;
    if ((direction === "ArrowDown" || direction === "down") && !cell.bottom) newY++;
    if ((direction === "ArrowLeft" || direction === "left") && !cell.left) newX--;
    if ((direction === "ArrowRight" || direction === "right") && !cell.right) newX++;

    if (newX !== x || newY !== y) {
      setPlayer({ x: newX, y: newY });
      if (newX === mazeCols - 1 && newY === mazeRows - 1) {
        setGameWon(true);
      }
    }
  };

  const handleRestart = () => {
    setMaze(generateMaze());
    setPlayer({ x: 0, y: 0 });
    setGameWon(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-white p-6">
      <h1 className="text-4xl font-bold mb-4">Maze Escape</h1>
      <canvas
        ref={canvasRef}
        width={mazeCols * cellSize}
        height={mazeRows * cellSize}
        className="border-4 border-blue-600 rounded-lg shadow-lg mb-4"
      ></canvas>

      {gameWon && (
        <p className="text-green-400 text-xl font-medium animate-pulse mb-4">You escaped the maze!</p>
      )}

      <div className="flex gap-2 flex-wrap justify-center mb-4">
        <button
          onClick={() => handleMove("up")}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded shadow"
        >
          Up
        </button>
        <button
          onClick={() => handleMove("left")}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded shadow"
        >
          Left
        </button>
        <button
          onClick={() => handleMove("down")}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded shadow"
        >
          Down
        </button>
        <button
          onClick={() => handleMove("right")}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded shadow"
        >
          Right
        </button>
      </div>

      <button
        onClick={handleRestart}
        className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 rounded-full text-white text-lg shadow-lg transition-all"
      >
        Restart Game
      </button>
    </div>
  );
};

export default MazeEscape;