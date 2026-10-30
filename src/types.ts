export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface Topic {
  id: string;
  title: string;
  desc: string;
  dueDate: string;
  isWeekly: boolean;
  category?: string;
  requirements?: string[];
}

export type GradeLevel = '特優' | '優等' | '甲等' | '尚可';

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  topicId: string;
  topicTitle: string;
  essayTitle: string;
  content: string;
  date: string;
  status: 'pending' | 'graded';
  score: number | null;
  level: GradeLevel | null;
  feedback: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  summary?: string;
  author?: string;
  date?: string;
  bookmarked?: boolean;
  flagged?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  passage?: string;
  dueDate: string;
  timeLimitMinutes?: number;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  answers: number[];
  score: number;
  totalPoints: number;
  submittedAt: string;
}
