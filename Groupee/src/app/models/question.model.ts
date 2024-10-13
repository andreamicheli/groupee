import { CumulativeResult } from './room.model';

export interface Option {
  id: number;
  text: string;
  values: CumulativeResult;
}

export interface Question {
  questionId: number;
  title: string;
  options: Option[];
  type: 'radio' | 'checkbox' | 'likert';
  url?: string;
  //correctAnswer?: string;
  order: number;
}
