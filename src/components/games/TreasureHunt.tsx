import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Trophy, Clock, Lightbulb } from 'lucide-react';

interface TreasureHuntProps {
  onBack: () => void;
  onComplete: (won: boolean, score: number) => void;
}

interface Clue {
  id: number;
  question: string;
  hint: string;
  answer: string;
  location: string;
  points: number;
}

const TreasureHunt: React.FC<TreasureHuntProps> = ({ onBack, onComplete }) => {
  const [currentClue, setCurrentClue] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [foundTreasures, setFoundTreasures] = useState<number[]>([]);

  const clues: Clue[] = [
    {
      id: 1,
      question: "I'm a place where knowledge flows like a river, with shelves that reach toward the sky. Students come to me when they seek wisdom. What am I?",
      hint: "Think about where books are kept in large quantities...",
      answer: "library",
      location: "University Library",
      points: 100
    },
    {
      id: 2,
      question: "I have keys but no locks, I have space but no room. You can enter but not go inside. What am I?",
      hint: "Think about something you use every day for typing...",
      answer: "keyboard",
      location: "Computer Lab",
      points: 150
    },
    {
      id: 3,
      question: "I'm round like the world, but flat as a board. I show you places you've never been before. What am I?",
      hint: "Think about something that shows geography...",
      answer: "map",
      location: "Geography Department",
      points: 120
    },
    {
      id: 4,
      question: "I have a face but no eyes, hands but no fingers. I tell you something important every second. What am I?",
      hint: "Think about something that shows time...",
      answer: "clock",
      location: "Clock Tower",
      points: 130
    },
    {
      id: 5,
      question: "I'm filled with knowledge but I'm not alive. I have pages but I'm not a book. Students carry me everywhere. What am I?",
      hint: "Think about something students use to take notes...",
      answer: "notebook",
      location: "Student Center",
      points: 200
    }
  ];

  useEffect(() => {
    if (timeLeft > 0 && gameStatus === 'playing') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameStatus('lost');
      onComplete(false, score);
    }
  }, [timeLeft, gameStatus, score, onComplete]);

  const handleSubmitAnswer = () => {
    const currentClueData = clues[currentClue];
    const isCorrect = userAnswer.toLowerCase().trim() === currentClueData.answer.toLowerCase();

    if (isCorrect) {
      const newScore = score + currentClueData.points + (showHint ? 0 : 50); // Bonus for not using hint
      setScore(newScore);
      setFoundTreasures([...foundTreasures, currentClueData.id]);
      
      if (currentClue === clues.length - 1) {
        setGameStatus('won');
        onComplete(true, newScore);
      } else {
        setCurrentClue(currentClue + 1);
        setUserAnswer('');
        setShowHint(false);
      }
    } else {
      // Wrong answer, show hint automatically
      setShowHint(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentClueData = clues[currentClue];

  if (gameStatus === 'won') {
    return (
      <div className="text-center py-8">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🎉 Treasure Found! 🎉
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Congratulations! You've found all the treasures!
        </p>
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800 mb-6">
          <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">
            Final Score: {score} points
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Time remaining: {formatTime(timeLeft)}
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors duration-200"
        >
          Back to Games
        </button>
      </div>
    );
  }

  if (gameStatus === 'lost') {
    return (
      <div className="text-center py-8">
        <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          ⏰ Time's Up! ⏰
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          The treasure hunt has ended. Better luck next time!
        </p>
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6 border border-red-200 dark:border-red-800 mb-6">
          <p className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
            Score: {score} points
          </p>
          <p className="text-sm text-red-700 dark:text-red-300">
            Treasures found: {foundTreasures.length}/{clues.length}
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors duration-200"
        >
          Back to Games
        </button>
      </div>
    );
  }

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
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
            <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              {score} pts
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {currentClue + 1} of {clues.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${((currentClue + 1) / clues.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Clue */}
      <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 mb-6">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Clue #{currentClueData.id}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Location: {currentClueData.location} • {currentClueData.points} points
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mb-4">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            {currentClueData.question}
          </p>
        </div>

        {showHint && (
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800 mb-4">
            <div className="flex items-start space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">Hint:</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {currentClueData.hint}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Answer:
            </label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmitAnswer}
              disabled={!userAnswer.trim()}
              className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Submit Answer
            </button>
            
            {!showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Show Hint
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Found Treasures */}
      {foundTreasures.length > 0 && (
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
          <h4 className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-2">
            🏆 Treasures Found ({foundTreasures.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {foundTreasures.map((treasureId) => (
              <span
                key={treasureId}
                className="px-2 py-1 bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-full text-xs font-medium"
              >
                #{treasureId}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TreasureHunt;