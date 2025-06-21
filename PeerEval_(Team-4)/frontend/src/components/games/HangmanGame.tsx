import React, { useState, useEffect } from 'react';
import { Target, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

const wordHints: { [key: string]: string } = {
  code: 'Instructions written to perform tasks',
  bug: 'An error in a program',
  data: 'Information stored or processed',
  loop: 'A programming construct for repetition',
  java: 'A popular object-oriented language',
  html: 'Markup language for web pages',
  node: 'JavaScript runtime built on Chrome’s V8',
  disk: 'Primary data storage hardware',
  byte: 'A group of 8 bits',
  api: 'Interface for software interaction',
  web: 'The network of connected documents',
  ram: 'Volatile memory used for active processes',
  cpu: 'Brain of the computer',
  sql: 'Used to query databases',
  json: 'Lightweight data-interchange format',
  unix: 'Operating system family',
  wifi: 'Wireless internet access technology',
  ping: 'Checks network latency',
  git: 'Version control system',
  port: 'Communication endpoint in networking'
};

const words = Object.keys(wordHints);

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'won':
      return {
        icon: CheckCircle,
        bg: 'bg-green-100 dark:bg-green-900/20',
        color: 'text-green-600 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800',
        label: 'Won',
      };
    case 'lost':
      return {
        icon: AlertTriangle,
        bg: 'bg-red-100 dark:bg-red-900/20',
        color: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        label: 'Lost',
      };
    default:
      return {
        icon: Clock,
        bg: 'bg-blue-100 dark:bg-blue-900/20',
        color: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
        label: 'Playing',
      };
  }
};

const HangmanDrawing = ({ wrongGuesses }: { wrongGuesses: number }) => {
  return (
    <svg width="120" height="160" className="text-purple-700 dark:text-purple-300">
      <line x1="10" y1="150" x2="110" y2="150" stroke="currentColor" strokeWidth="4" />
      <line x1="30" y1="150" x2="30" y2="10" stroke="currentColor" strokeWidth="4" />
      <line x1="30" y1="10" x2="80" y2="10" stroke="currentColor" strokeWidth="4" />
      <line x1="80" y1="10" x2="80" y2="30" stroke="currentColor" strokeWidth="4" />
      {wrongGuesses > 0 && <circle cx="80" cy="40" r="10" stroke="currentColor" strokeWidth="3" fill="none" />}
      {wrongGuesses > 1 && <line x1="80" y1="50" x2="80" y2="90" stroke="currentColor" strokeWidth="3" />}
      {wrongGuesses > 2 && <line x1="80" y1="60" x2="60" y2="80" stroke="currentColor" strokeWidth="3" />}
      {wrongGuesses > 3 && <line x1="80" y1="60" x2="100" y2="80" stroke="currentColor" strokeWidth="3" />}
      {wrongGuesses > 4 && <line x1="80" y1="90" x2="65" y2="120" stroke="currentColor" strokeWidth="3" />}
      {wrongGuesses > 5 && <line x1="80" y1="90" x2="95" y2="120" stroke="currentColor" strokeWidth="3" />}
    </svg>
  );
};

interface HangmanGameProps {
  onBack: () => void;
  onComplete: (won: boolean, score: number) => void;
}

const HangmanGame: React.FC<HangmanGameProps> = ({ onBack, onComplete }) => {
  const [word, setWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [status, setStatus] = useState('playing');

  const initializeGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
    setWord(randomWord);
    setGuesses([]);
    setWrongGuesses(0);
    setStatus('playing');
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (status === 'won') {
      onComplete && onComplete(true, 100);
    } else if (status === 'lost') {
      onComplete && onComplete(false, 0);
    }
  }, [status, onComplete]);

  const handleGuess = (char: string) => {
    if (status !== 'playing' || guesses.includes(char)) return;
    const newGuesses = [...guesses, char];
    setGuesses(newGuesses);
    if (!word.includes(char)) {
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);
      if (newWrong >= 6) setStatus('lost');
    } else if (word.split('').every((l) => newGuesses.includes(l))) {
      setStatus('won');
    }
  };

  const displayWord = word
    .split('')
    .map((char) => (guesses.includes(char) ? char : '_'))
    .join(' ');

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;
  const hint = wordHints[word];

  return (
    <div className="bg-gradient-to-br from-white via-indigo-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl p-4 sm:p-6 shadow-xl dark:shadow-gray-900/40 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Tech Hangman</h3>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Guess the tech term!</p>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <HangmanDrawing wrongGuesses={wrongGuesses} />
        <p className="text-2xl font-mono tracking-widest text-blue-800 dark:text-blue-300">{displayWord}</p>
        <p className="text-sm text-purple-600 dark:text-purple-400">Wrong guesses: {wrongGuesses}/6</p>
        <div className="text-sm italic text-gray-800 dark:text-gray-300">Hint: {hint}</div>
        <div className="grid grid-cols-7 gap-2">
          {'abcdefghijklmnopqrstuvwxyz'.split('').map((char) => (
            <button
              key={char}
              onClick={() => handleGuess(char)}
              disabled={guesses.includes(char) || status !== 'playing'}
              className="w-8 h-8 text-sm rounded-full font-semibold bg-pink-100 dark:bg-pink-700 hover:bg-pink-300 dark:hover:bg-pink-500 text-gray-900 dark:text-white disabled:opacity-30"
            >
              {char}
            </button>
          ))}
        </div>
        <div className={`flex items-center space-x-2 mt-4 px-3 py-1.5 rounded-xl border ${statusConfig.border} ${statusConfig.bg}`}>
          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
          <span className={`text-sm font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
        </div>

        {status !== 'playing' && (
          <button
            onClick={initializeGame}
            className="mt-4 flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-lime-400 to-green-500 text-white hover:from-lime-500 hover:to-green-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        )}
        <button
          onClick={onBack}
          className="mt-4 flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-600 hover:bg-gray-700 text-white transition-colors"
        >
          Back to Games
        </button>
      </div>
    </div>
  );
};

export default HangmanGame;