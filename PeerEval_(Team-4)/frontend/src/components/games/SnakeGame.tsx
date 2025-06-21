import React, { useEffect, useRef, useState } from "react";

const canvasSize = 400;
const scale = 20;
const rows = canvasSize / scale;
const cols = canvasSize / scale;

const getRandomFood = (snake: { x: number; y: number }[]): { x: number; y: number } => {
  let food: { x: number; y: number };
  do {
    food = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  return food;
};


interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onBack: () => void;
  onComplete: (won: boolean, score: number) => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onBack, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 });
  const [food, setFood] = useState<Position>(getRandomFood([{ x: 10, y: 10 }]));
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;

    const interval = setInterval(() => {
      if (started) {
        update();
        draw(context);
      }
    }, 200);

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!started || gameOver) return;
    switch (e.key) {
      case "ArrowUp":
        if (direction.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case "ArrowDown":
        if (direction.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case "ArrowLeft":
        if (direction.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case "ArrowRight":
        if (direction.x !== -1) setDirection({ x: 1, y: 0 });
        break;
    }
  };

  const update = () => {
    if (gameOver || (direction.x === 0 && direction.y === 0)) return;

    const newSnake = [...snake];
    const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

    if (
      head.x < 0 ||
      head.x >= cols ||
      head.y < 0 ||
      head.y >= rows ||
      newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
      setStarted(false);
      onComplete && onComplete(false, newSnake.length * 10);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(getRandomFood(newSnake));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.fillStyle = "#38bdf8";
    snake.forEach((segment) => {
      ctx.fillRect(segment.x * scale, segment.y * scale, scale - 2, scale - 2);
    });

    ctx.fillStyle = "#4ade80";
    ctx.fillRect(food.x * scale, food.y * scale, scale - 2, scale - 2);
  };

  const handleReset = () => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setDirection({ x: 0, y: 0 });
    setFood(getRandomFood(initialSnake));
    setGameOver(false);
    setStarted(false);
  };

  const handleStart = () => {
    setStarted(true);
    setDirection({ x: 1, y: 0 });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-white p-6">
      <h1 className="text-4xl font-bold mb-4">Snake Game</h1>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="border-4 border-blue-600 rounded-lg shadow-lg mb-6"
      ></canvas>

      {gameOver && (
        <p className="text-red-400 text-2xl font-semibold mb-4 animate-bounce">
          Game Over! Press reset to play again.
        </p>
      )}

      {!started && !gameOver && (
        <button
          onClick={handleStart}
          className="mb-4 px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 rounded-full text-white text-lg shadow-lg transition-all"
        >
          Start Game
        </button>
      )}

      <button
        onClick={handleReset}
        className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 rounded-full text-white text-lg shadow-lg transition-all"
      >
        Reset Game
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

export default SnakeGame;