import React, { useState } from "react";
import { ArrowLeft} from 'lucide-react';


const WORD_LIST = ["react", "train", "flame", "brush", "ghost", "plant", "glide", "jumps"];
const MAX_ATTEMPTS = 6;

const getRandomWord = () => WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];

interface WordleCloneProps {
  onBack: () => void;
  onComplete: (won: boolean, score: number) => void;
}

const WordleClone: React.FC<WordleCloneProps> = ({ onBack, onComplete }) => {
  const [targetWord, setTargetWord] = useState<string>(getRandomWord());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);

  const handleGuess = () => {
    if (currentGuess.length !== 5 || gameOver) return;

    const guess = currentGuess.toLowerCase();
    setGuesses((prev) => [...prev, guess]);

    if (guess === targetWord) {
      setMessage("🎉 You guessed the word!");
      setGameOver(true);
      onComplete && onComplete(true, 100);
    } else if (guesses.length + 1 === MAX_ATTEMPTS) {
      setMessage(`You lose! The word was "${targetWord}".`);
      setGameOver(true);
      onComplete && onComplete(false, 0);
    }

    setCurrentGuess("");
  };

  const resetGame = () => {
    setTargetWord(getRandomWord());
    setGuesses([]);
    setCurrentGuess("");
    setMessage("");
    setGameOver(false);
  };

  const getLetterColor = (letter: string, index: number) => {
    if (letter === targetWord[index]) return "bg-green-500";
    if (targetWord.includes(letter)) return "bg-yellow-400";
    return "bg-gray-600";
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
        <h1 className="text-4xl font-bold mb-6">Wordle Clone</h1>

        <div className="grid gap-2 mb-6">
          {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => (
            <div className="flex gap-2" key={rowIndex}>
              {Array.from({ length: 5 }).map((_, colIndex) => {
                const guess = guesses[rowIndex] || "";
                const letter = guess[colIndex] || "";
                const color = guess ? getLetterColor(letter, colIndex) : "bg-slate-700";
                return (
                  <div
                    key={colIndex}
                    className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-md font-bold text-xl uppercase ${color}`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {!gameOver && (
          <div className="mb-6">
            <input
              type="text"
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value.slice(0, 5))}
              className="w-48 p-2 text-black rounded-lg text-center shadow-inner mb-2"
              placeholder="Enter 5-letter word"
            />
            <button
              onClick={handleGuess}
              className="ml-4 px-6 py-2 bg-blue-700 hover:bg-blue-600 rounded-full text-white text-lg shadow-md transition-all"
            >
              Submit
            </button>
          </div>
        )}

        {message && <p className="text-xl font-semibold text-amber-300 mb-4 animate-pulse">{message}</p>}

        <button
          onClick={resetGame}
          className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 rounded-full text-white text-lg shadow-lg transition-all"
        >
          Reset Game
        </button>
      </div>
      {/* How to Play / Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          📝 How to Play
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Guess the 5-letter word in 6 tries. Each guess will show which letters are correct and in the right place (green), correct but in the wrong place (yellow), or not in the word (gray).
        </p>
      </div>
    </div>
  );
};

export default WordleClone;