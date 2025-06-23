import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Flame, Move3D, Clock, RefreshCw } from "lucide-react";

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
  const [moves, setMoves] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
      if (intervalRef.current) clearInterval(intervalRef.current);
      onComplete && onComplete(false, newSnake.length * 10);
      return;
    }

    newSnake.unshift(head);
    setMoves((prev) => prev + 1);

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
    setMoves(0);
    setTime(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleStart = () => {
    setStarted(true);
    setDirection({ x: 1, y: 0 });
    intervalRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-indigo-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white p-6">
      <div className="w-full max-w-2xl">
        {/* Header: Back + Reset */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Games</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white text-sm font-medium transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Score / Moves / Time */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center border border-green-200 dark:border-green-800">
            <Flame className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-green-800 dark:text-green-200">{snake.length * 10}</p>
            <p className="text-sm text-green-600 dark:text-green-400">Score</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-center border border-yellow-200 dark:border-yellow-800">
            <Move3D className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-yellow-800 dark:text-yellow-200">{moves}</p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Moves</p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 text-center border border-indigo-200 dark:border-indigo-800">
            <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-indigo-800 dark:text-indigo-200">{time}s</p>
            <p className="text-sm text-indigo-600 dark:text-indigo-400">Time</p>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200 dark:border-gray-700 mb-6">
          <h1 className="text-4xl font-bold mb-4 text-center text-gray-900 dark:text-white">Snake Game</h1>
          <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            className="border-4 border-blue-600 rounded-lg shadow-lg mx-auto block mb-6"
          ></canvas>

          {gameOver && (
            <p className="text-red-400 text-2xl font-semibold mb-4 text-center animate-bounce">
              Game Over! Press reset to play again.
            </p>
          )}

          {!started && !gameOver && (
            <div className="flex justify-center mb-4">
              <button
                onClick={handleStart}
                className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 rounded-full text-white text-lg shadow-lg transition-all"
              >
                Start Game
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">🐍 How to Play</h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Use arrow keys to control the snake. Eat food to grow. Avoid hitting the walls or yourself!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
