export type Grade = 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5';
export type Subject = 'math' | 'russian' | 'english' | 'reading' | 'traffic' | 'informatics' | 'logic' | 'world' | 'meta';
export type ViewType = 'home' | 'olympiads' | 'faq' | 'about' | 'contacts' | 'auth' | 'profile' | 'change-password' | 'olympiad-quiz';

export interface Olympiad {
  id: string;
  subject: Subject;
  grade: Grade;
  title: string;
  description: string;
  duration: number;
  questionsCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number;
  certificateTemplate: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  grade: Grade;
  registrationDate: Date;
  results: OlympiadResult[];
}

export interface OlympiadResult {
  olympiadId: string;
  score: number;
  maxScore: number;
  completedAt: Date;
  certificateUrl?: string;
  position: number;
  totalParticipants: number;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizState {
  olympiadId: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: number[];
  timeLeft: number;
  isComplete: boolean;
  startTime: Date;
}
