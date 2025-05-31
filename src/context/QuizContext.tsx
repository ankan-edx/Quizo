import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Quiz, Question, PlayerAnswer, PlayerResult, LeaderboardEntry } from '../types';
import { sampleQuiz, sampleLeaderboard } from '../data/quizData';

interface QuizContextType {
  currentQuiz: Quiz;
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  playerName: string;
  playerAnswers: PlayerAnswer[];
  leaderboard: LeaderboardEntry[];
  quizStarted: boolean;
  quizCompleted: boolean;
  editorMode: boolean;
  setPlayerName: (name: string) => void;
  startQuiz: () => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  submitAnswer: (answer: PlayerAnswer) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  changeQuiz: (quiz: Quiz) => void;
  updateQuiz: (quiz: Quiz) => void;
  getPlayerResult: () => PlayerResult | null;
  getProgressPercentage: () => number;
  getTotalScore: () => number;
  getMaxPossibleScore: () => number;
  setEditorMode: (mode: boolean) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz>(sampleQuiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [playerName, setPlayerName] = useState<string>('');
  const [playerAnswers, setPlayerAnswers] = useState<PlayerAnswer[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(
    sampleLeaderboard.sort((a, b) => b.score - a.score).map((entry, index) => ({
      ...entry,
      rank: index + 1
    })) as LeaderboardEntry[]
  );
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [editorMode, setEditorMode] = useState<boolean>(false);

  const currentQuestion = currentQuestionIndex >= 0 && currentQuestionIndex < currentQuiz.questions.length
    ? currentQuiz.questions[currentQuestionIndex]
    : null;

  const startQuiz = () => {
    if (playerName.trim() === '') return;
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setPlayerAnswers([]);
    setQuizCompleted(false);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(-1);
    setPlayerAnswers([]);
    setEditorMode(false);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitAnswer = (answer: PlayerAnswer) => {
    const existingAnswerIndex = playerAnswers.findIndex(a => a.questionId === answer.questionId);
    
    if (existingAnswerIndex >= 0) {
      setPlayerAnswers(prev => [
        ...prev.slice(0, existingAnswerIndex),
        answer,
        ...prev.slice(existingAnswerIndex + 1)
      ]);
    } else {
      setPlayerAnswers(prev => [...prev, answer]);
    }
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
    const result = getPlayerResult();
    
    if (result) {
      const newLeaderboard = [...leaderboard, {
        rank: 0,
        playerName: result.playerName,
        score: result.score,
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        completedAt: result.completedAt
      }];
      
      const sortedLeaderboard = newLeaderboard
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1
        }));
      
      setLeaderboard(sortedLeaderboard);
    }
  };

  const changeQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    resetQuiz();
  };

  const updateQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    resetQuiz();
  };

  const getPlayerResult = (): PlayerResult | null => {
    if (!quizStarted || playerAnswers.length === 0) return null;
    
    const correctAnswers = playerAnswers.filter(answer => answer.isCorrect).length;
    const score = playerAnswers.reduce((total, answer) => total + answer.points, 0);
    
    return {
      playerId: `player-${Date.now()}`,
      playerName,
      score,
      correctAnswers,
      totalQuestions: currentQuiz.questions.length,
      answers: playerAnswers,
      completedAt: new Date()
    };
  };

  const getProgressPercentage = (): number => {
    if (!quizStarted) return 0;
    return Math.round((playerAnswers.length / currentQuiz.questions.length) * 100);
  };

  const getTotalScore = (): number => {
    return playerAnswers.reduce((total, answer) => total + answer.points, 0);
  };

  const getMaxPossibleScore = (): number => {
    return currentQuiz.questions.reduce((total, question) => total + question.points, 0);
  };

  const value = {
    currentQuiz,
    currentQuestion,
    currentQuestionIndex,
    playerName,
    playerAnswers,
    leaderboard,
    quizStarted,
    quizCompleted,
    editorMode,
    setPlayerName,
    startQuiz,
    goToNextQuestion,
    goToPreviousQuestion,
    submitAnswer,
    completeQuiz,
    resetQuiz,
    changeQuiz,
    updateQuiz,
    getPlayerResult,
    getProgressPercentage,
    getTotalScore,
    getMaxPossibleScore,
    setEditorMode
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};