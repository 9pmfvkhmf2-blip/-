import { Topic, Article, Submission, User, Quiz, QuizAttempt } from './types';

export const INITIAL_TEACHER: User = {
  id: 'teacher_wen',
  name: 'wen 老師',
  email: 'wen@academy.edu',
  role: 'teacher',
};

export const INITIAL_STUDENTS: User[] = [];

export const INITIAL_DAILY_QUOTE = '';

export const INITIAL_TOPICS: Topic[] = [];

export const INITIAL_ARTICLES: Article[] = [];

export const INITIAL_SUBMISSIONS: Submission[] = [];

export const INITIAL_QUIZZES: Quiz[] = [];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [];
