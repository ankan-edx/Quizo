import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { CheckCircle, XCircle, Award, BarChart3 } from 'lucide-react';
import classNames from 'classnames';

const ResultsScreen: React.FC = () => {
  const { 
    getPlayerResult, 
    resetQuiz,
    currentQuiz,
    playerAnswers
  } = useQuiz();

  const result = getPlayerResult();

  if (!result) return null;

  const scorePercentage = Math.round((result.score / currentQuiz.questions.reduce((total, q) => total + q.points, 0)) * 100);
  const correctPercentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);

  const getScoreMessage = () => {
    if (scorePercentage >= 90) return "Excellent! You're a quiz master!";
    if (scorePercentage >= 70) return "Great job! You know your stuff!";
    if (scorePercentage >= 50) return "Good effort! Keep learning!";
    return "Keep practicing! You'll get better!";
  };

  return (
    <div className="glass-panel p-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-500/20 mb-4">
          <Award className="w-10 h-10 text-primary-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
        <p className="text-gray-300">{getScoreMessage()}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center mb-2">
            <BarChart3 className="w-5 h-5 text-accent-400 mr-2" />
            <h3 className="font-medium">Your Score</h3>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-accent-400">{result.score}</span>
            <span className="text-gray-400 ml-2">/ {currentQuiz.questions.reduce((total, q) => total + q.points, 0)} points</span>
          </div>
          <div className="mt-2 progress-bar">
            <div 
              className="progress-bar-fill bg-accent-500"
              style={{ width: `${scorePercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-5 h-5 text-success-400 mr-2" />
            <h3 className="font-medium">Correct Answers</h3>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-success-400">{result.correctAnswers}</span>
            <span className="text-gray-400 ml-2">/ {result.totalQuestions} questions</span>
          </div>
          <div className="mt-2 progress-bar">
            <div 
              className="progress-bar-fill bg-success-500"
              style={{ width: `${correctPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="font-medium mb-3">Question Summary</h3>
        <div className="space-y-2">
          {currentQuiz.questions.map((question, index) => {
            const answer = playerAnswers.find(a => a.questionId === question.id);
            return (
              <div 
                key={question.id}
                className={classNames('flex items-center p-3 rounded-lg', {
                  'bg-success-500/10 border border-success-500/20': answer?.isCorrect,
                  'bg-error-500/10 border border-error-500/20': answer && !answer.isCorrect
                })}
              >
                <div className="mr-3">
                  {answer?.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-success-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-error-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    Question {index + 1}: {question.text}
                  </p>
                </div>
                <div className="text-sm font-medium ml-2">
                  {answer?.points} / {question.points}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={resetQuiz}
          className="btn-primary"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;