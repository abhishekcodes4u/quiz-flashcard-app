export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers?: string[];
}

export interface QuizSettings {
  amount: number;
  category: number;
  difficulty: string;
}

export interface HighScore {
  name: string;
  score: number;
  total: number;
  date: string;
  category: string;
}

export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  category: string;
  isFlipped: boolean;
  isLearned: boolean;
}

export interface QuizCategory {
  id: number;
  name: string;
}

export interface OpenTDBResponse {
  response_code: number;
  results: Question[];
}

export interface OpenTDBCategoryResponse {
  trivia_categories: QuizCategory[];
}
