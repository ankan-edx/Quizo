import React from 'react';
import { Brain } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

const QuizHeader: React.FC = () => {
  const { 
    currentQuiz, 
    quizStarted, 
    quizCompleted, 
    playerName, 
    getProgressPercentage,
    getTotalScore,
    getMaxPossibleScore
  } = useQuiz();

  return (
    <header className="glass-panel p-4 sm:p-6 mb-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Brain className="w-8 h-8 text-primary-400 mr-3" />
          <h1 className="text-xl sm:text-2xl font-bold">{currentQuiz.title}</h1>
        </div>
        
        {quizStarted && !quizCompleted && (
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-300">{playerName}</span>
            <span className="text-sm font-medium">
              Score: {getTotalScore()} / {getMaxPossibleScore()}
            </span>
          </div>
        )}
      </div>
      
      {quizStarted && !quizCompleted && (
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{getProgressPercentage()}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
      )}
    </header>
  );
};

export default QuizHeader;