import { Quiz, QuestionType } from '../types';

export const sampleQuiz: Quiz = {
  id: 'quiz-1',
  title: 'Programming Fundamentals',
  description: 'Test your knowledge of programming concepts, data structures, and algorithms. Perfect for both beginners and experienced developers!',
  questions: [
    {
      id: 'q1',
      text: 'Which data structure follows the Last-In-First-Out (LIFO) principle?',
      type: QuestionType.SINGLE_SELECT,
      options: [
        { id: 'q1-opt1', text: 'Queue', isCorrect: false },
        { id: 'q1-opt2', text: 'Stack', isCorrect: true },
        { id: 'q1-opt3', text: 'Linked List', isCorrect: false },
        { id: 'q1-opt4', text: 'Array', isCorrect: false }
      ],
      points: 10,
      explanation: 'A Stack follows the LIFO principle where the last element added is the first one to be removed.'
    },
    {
      id: 'q2',
      text: 'Which of the following are object-oriented programming principles?',
      type: QuestionType.MULTIPLE_SELECT,
      options: [
        { id: 'q2-opt1', text: 'Encapsulation', isCorrect: true },
        { id: 'q2-opt2', text: 'Iteration', isCorrect: false },
        { id: 'q2-opt3', text: 'Polymorphism', isCorrect: true },
        { id: 'q2-opt4', text: 'Assignment', isCorrect: false },
        { id: 'q2-opt5', text: 'Inheritance', isCorrect: true }
      ],
      points: 15,
      explanation: 'The main principles of OOP are Encapsulation, Polymorphism, Inheritance, and Abstraction.'
    },
    {
      id: 'q3',
      text: 'What is the time complexity of binary search?',
      type: QuestionType.FILL_IN_BLANK,
      options: [
        { id: 'q3-opt1', text: 'O(log n)', isCorrect: true }
      ],
      points: 10,
      explanation: 'Binary search has a time complexity of O(log n) as it divides the search space in half with each iteration.'
    }
  ]
};

export const sampleLeaderboard = [
  {
    playerId: 'player1',
    playerName: 'Sarah Chen',
    score: 85,
    correctAnswers: 5,
    totalQuestions: 6,
    completedAt: new Date('2025-03-10T14:30:00')
  },
  {
    playerId: 'player2',
    playerName: 'Michael Rodriguez',
    score: 75,
    correctAnswers: 4,
    totalQuestions: 6,
    completedAt: new Date('2025-03-11T09:15:00')
  },
  {
    playerId: 'player3',
    playerName: 'Emma Thompson',
    score: 95,
    correctAnswers: 6,
    totalQuestions: 6,
    completedAt: new Date('2025-03-09T16:45:00')
  }
];