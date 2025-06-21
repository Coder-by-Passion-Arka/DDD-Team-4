import React, { useState } from "react";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-white p-6">
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
      <button
        onClick={onBack}
        className="mt-4 px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-full text-white text-lg shadow-lg transition-all"
      >
        Back to Games
      </button>
    </div>
  );
};

export default WordleClone;