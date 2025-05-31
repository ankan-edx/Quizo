import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { Brain, Edit3, Trophy } from 'lucide-react';

const WelcomeScreen: React.FC = () => {
  const { currentQuiz, playerName, setPlayerName, startQuiz, setEditorMode } = useQuiz();
  const [nameError, setNameError] = useState<string>('');

  const handleStartQuiz = () => {
    if (playerName.trim() === '') {
      setNameError('Please enter your name to start');
      return;
    }
    startQuiz();
  };

  return (
    <div className="glass-panel p-6 sm:p-8 animate-fade-in">
      <div className="flex flex-col items-center mb-8">
        <Brain className="w-16 h-16 text-primary-400 mb-4" />
        <h1 className="text-3xl font-bold text-center mb-2">{currentQuiz.title}</h1>
        <p className="text-gray-300 text-center max-w-lg">
          {currentQuiz.description}
        </p>
      </div>

      <div className="mb-8">
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h2 className="font-semibold mb-2">Quiz Details:</h2>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• {currentQuiz.questions.length} questions</li>
            <li>• Multiple question types including single-select, multiple-select, and fill-in-the-blank</li>
            <li>• Total points: {currentQuiz.questions.reduce((total, q) => total + q.points, 0)}</li>
            <li>• Your score will be added to the leaderboard upon completion</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium mb-1">
            Enter Your Name
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setNameError('');
            }}
            placeholder="Your name"
            className="input-field"
            autoFocus
          />
          {nameError && <p className="text-error-400 text-sm mt-1">{nameError}</p>}
        </div>
        
        <button
          onClick={handleStartQuiz}
          className="btn-primary w-full"
        >
          Start Quiz
        </button>

        <div className="flex gap-3 mt-6">
          <button 
            onClick={() => setEditorMode(true)}
            className="btn-outline flex-1"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Questions
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen