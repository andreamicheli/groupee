export interface Question {
  questionId: number;
  title: string;
  options: { text: string }[];
  type: 'radio' | 'checkbox' | 'likert';
  url?: string;
  //correctAnswer?: string;
  order: number;
}
