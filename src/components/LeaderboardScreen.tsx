import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { Medal, Clock, Trophy } from 'lucide-react';

const LeaderboardScreen: React.FC = () => {
  const { leaderboard, resetQuiz } = useQuiz();
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="glass-panel p-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-500/20 mb-4">
          <Trophy className="w-10 h-10 text-primary-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Leaderboard</h2>
        <p className="text-gray-300">See how you compare with other players</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left">Rank</th>
              <th className="px-4 py-3 text-left">Player</th>
              <th className="px-4 py-3 text-right">Score</th>
              <th className="px-4 py-3 text-right hidden sm:table-cell">Correct</th>
              <th className="px-4 py-3 text-right hidden md:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr 
                key={`${entry.playerName}-${entry.completedAt.toString()}`} 
                className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    {entry.rank === 1 ? (
                      <Medal className="w-5 h-5 text-yellow-400 mr-1" />
                    ) : entry.rank === 2 ? (
                      <Medal className="w-5 h-5 text-gray-400 mr-1" />
                    ) : entry.rank === 3 ? (
                      <Medal className="w-5 h-5 text-amber-700 mr-1" />
                    ) : (
                      <span className="w-5 h-5 inline-flex items-center justify-center mr-1">
                        {entry.rank}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{entry.playerName}</td>
                <td className="px-4 py-3 text-right font-bold">{entry.score}</td>
                <td className="px-4 py-3 text-right hidden sm:table-cell">
                  {entry.correctAnswers}/{entry.totalQuestions}
                </td>
                <td className="px-4 py-3 text-right text-gray-400 hidden md:table-cell">
                  <div className="flex items-center justify-end">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatDate(entry.completedAt)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-center mt-8">
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

export default LeaderboardScreen;