export enum QuestionType {
  SINGLE_SELECT = 'SINGLE_SELECT',
  MULTIPLE_SELECT = 'MULTIPLE_SELECT',
  FILL_IN_BLANK = 'FILL_IN_BLANK'
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: Option[];
  points: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface PlayerAnswer {
  questionId: string;
  selectedOptionIds: string[];
  textAnswer?: string;
  isCorrect: boolean;
  points: number;
}

export interface PlayerResult {
  playerId: string;
  playerName: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  answers: PlayerAnswer[];
  completedAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: Date;
}