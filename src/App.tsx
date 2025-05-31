import React, { useState } from 'react';
import { QuizProvider } from './context/QuizContext';
import BackgroundAnimation from './components/BackgroundAnimation';
import QuizHeader from './components/QuizHeader';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionCard from './components/QuestionCard';
import ResultsScreen from './components/ResultsScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import QuestionEditor from './components/QuestionEditor';
import { useQuiz } from './context/QuizContext';
import { Trophy } from 'lucide-react';

const AppContent: React.FC = () => {
  const { quizStarted, quizCompleted, editorMode } = useQuiz();
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  
  const toggleLeaderboard = () => {
    setShowLeaderboard(prev => !prev);
  };
  
  return (
    <div className="min-h-screen py-8">
      <div className="quiz-container">
        <QuizHeader />
        
        {!quizStarted && !editorMode && (
          <div className="flex flex-col">
            <WelcomeScreen />
            
            <button 
              onClick={toggleLeaderboard}
              className="btn-outline flex items-center justify-center mx-auto mt-6"
            >
              <Trophy className="w-4 h-4 mr-2" />
              View Leaderboard
            </button>
          </div>
        )}
        
        {editorMode && <QuestionEditor />}
        
        {quizStarted && !quizCompleted && <QuestionCard />}
        
        {quizCompleted && !showLeaderboard && (
          <div className="flex flex-col">
            <ResultsScreen />
            
            <button 
              onClick={toggleLeaderboard}
              className="btn-outline flex items-center justify-center mx-auto mt-6"
            >
              <Trophy className="w-4 h-4 mr-2" />
              View Leaderboard
            </button>
          </div>
        )}
        
        {showLeaderboard && <LeaderboardScreen />}
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <BackgroundAnimation selector="background-animation" />
      <QuizProvider>
        <AppContent />
      </QuizProvider>
    </>
  );
}

export default App;