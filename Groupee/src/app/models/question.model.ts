export interface Question {
    questionId: number;
    title: string;
    options: string[];
    type: string;
    url: string;
    //correctAnswer?: string;
    order: number;
  }
  