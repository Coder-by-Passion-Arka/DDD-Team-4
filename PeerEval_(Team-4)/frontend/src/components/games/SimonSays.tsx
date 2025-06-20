
import React,  {useState } from "react";

const colors = ["green", "red", "yellow", "blue"];
const colorMap: Record<string, string> = {
  green: "bg-green-500",
  red: "bg-red-500",
  yellow: "bg-yellow-400",
  blue: "bg-blue-500",
};

const SimonSays: React.FC = () => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState("Click start to play!");
  const [level, setLevel] = useState(0);

  const playSequence = async (seq: string[]) => {
    setIsPlayerTurn(false);
    for (const color of seq) {
      setActiveColor(color);
      await new Promise((res) => setTimeout(res, 500));
      setActiveColor(null);
      await new Promise((res) => setTimeout(res, 200));
    }
    setIsPlayerTurn(true);
    setMessage("Your turn!");
  };

  const startGame = () => {
    const firstColor = colors[Math.floor(Math.random() * colors.length)];
    const newSequence = [firstColor];
    setSequence(newSequence);
    setPlayerIndex(0);
    setLevel(1);
    setGameStarted(true);
    setMessage("Watch the sequence");
    playSequence(newSequence);
  };

  const stopGame = () => {
    setGameStarted(false);
    setSequence([]);
    setPlayerIndex(0);
    setLevel(0);
    setMessage("Game stopped. Click start to play again.");
  };

  const nextRound = () => {
    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    const newSequence = [...sequence, nextColor];
    setSequence(newSequence);
    setPlayerIndex(0);
    setLevel(level + 1);
    setMessage("Watch the sequence");
    playSequence(newSequence);
  };

  const handlePlayerInput = (color: string) => {
    if (!isPlayerTurn || !gameStarted) return;
    if (color === sequence[playerIndex]) {
      if (playerIndex + 1 === sequence.length) {
        setMessage("Good job! Next round...");
        setTimeout(nextRound, 1000);
      } else {
        setPlayerIndex(playerIndex + 1);
      }
    } else {
      setMessage("Wrong color! You lose at Level " + level);
      setGameStarted(false);
      setIsPlayerTurn(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-white p-6">
      <h1 className="text-4xl font-bold mb-4">Simon Says</h1>
      <p className="text-xl mb-2">{message}</p>
      {gameStarted && <p className="text-lg mb-4">Level: {level}</p>}

      <div className="grid grid-cols-2 gap-4 mb-6">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => handlePlayerInput(color)}
            className={`w-32 h-32 rounded-lg shadow-lg border-2 border-white transition-all duration-200 focus:outline-none ${
              colorMap[color]
            } ${activeColor === color ? "brightness-150 scale-105" : ""}`}
          ></button>
        ))}
      </div>

      <div className="flex space-x-4">
        {!gameStarted && (
          <button
            onClick={startGame}
            className="px-6 py-2 text-lg font-medium bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-full shadow-lg"
          >
            Start Game
          </button>
        )}
        {gameStarted && (
          <button
            onClick={stopGame}
            className="px-6 py-2 text-lg font-medium bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white rounded-full shadow-lg"
          >
            Stop Game
          </button>
        )}
      </div>
    </div>
  );
};

export default SimonSays;