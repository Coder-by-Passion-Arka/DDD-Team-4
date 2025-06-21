import React, { useState } from "react";
import { ArrowLeft} from 'lucide-react';

interface NumberGuessingGameProps {
  onBack: () => void;
  onComplete: (won: boolean, score: number) => void;
}

const NumberGuessingGame: React.FC<NumberGuessingGameProps> = ({ onBack, onComplete }) => {
  const [secretNumber, setSecretNumber] = useState<number>(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [guesses, setGuesses] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const handleGuess = () => {
    const numericGuess = parseInt(guess);
    if (isNaN(numericGuess) || numericGuess < 1 || numericGuess > 100) {
      setMessage("Please enter a valid number between 1 and 100.");
      return;
    }

    setGuesses((prev) => [...prev, numericGuess]);

    if (numericGuess === secretNumber) {
      setMessage("🎉 You guessed it right!");
      setGameOver(true);
      onComplete && onComplete(true, 100);
    } else if (numericGuess < secretNumber) {
      setMessage("Too low. Try again.");
    } else {
      setMessage("Too high. Try again.");
    }
    setGuess("");
  };

  const handleReset = () => {
    setSecretNumber(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setMessage("");
    setGuesses([]);
    setGameOver(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Games</span>
        </button>
      </div>
      {/* Game Card */}
      <div className="bg-gradient-to-br from-white via-indigo-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl p-4 sm:p-6 shadow-xl dark:shadow-gray-900/40 border border-gray-200 dark:border-gray-700 mb-6">
        <h1 className="text-4xl font-bold mb-4">Number Guessing Game</h1>
        <p className="mb-4 text-lg">Guess the number between 1 and 100</p>

        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className="w-48 p-2 mb-4 text-black rounded-lg text-center shadow-inner"
          disabled={gameOver}
        />
        <button
          onClick={handleGuess}
          disabled={gameOver}
          className="mb-4 px-6 py-2 bg-blue-700 hover:bg-blue-600 rounded-full text-white text-lg shadow-md transition-all"
        >
          Guess
        </button>

        {message && <p className="text-xl font-medium mb-4 text-amber-300">{message}</p>}

        {guesses.length > 0 && (
          <div className="mb-6">
            <p className="mb-2">Your guesses:</p>
            <div className="flex flex-wrap gap-2">
              {guesses.map((g, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-600 rounded-full shadow text-white">
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 rounded-full text-white text-lg shadow-lg transition-all"
        >
          Reset Game
        </button>
      </div>
      {/* How to Play / Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          🔢 How to Play
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Guess the secret number between 1 and 100. Enter your guess and get feedback. Try to guess in as few attempts as possible!
        </p>
      </div>
    </div>
  );
};

export default NumberGuessingGame;