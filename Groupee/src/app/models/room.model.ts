import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export interface CumulativeResult {
  element1: number;
  element2: number;
  element3: number;
  element4: number;
  element5: number;
}

export interface Participant {
  participantId: string;
  name: string;
  email: string;
  phone: string;
  cumulativeResult: CumulativeResult;
}

export interface Group {
  name: string;
  id: string;
  participants: Participant[];
  totalVariables: number[];
}

export interface Room {
  roomId: string;
  hostId: string;
  //participants: Participant[];
  isQuestionnaireActive: boolean;
  currentQuestionIndex: number;
  isQuestionnaireEnded: false;
  participantAnswers: {
    [participantId: string]: {
      [questionIndex: number]: string;
    };
  };
  createdAt: firebase.firestore.FieldValue | Date;
}

export enum ParticipantState {
  WaitingForQuestion, //maybe useless, deprecated by model.session.currentPhase
  ViewingQuestion,
  WaitingForNextQuestion,
  QuestionnaireFinished, //maybe useless, deprecated by model.session.currentPhase
}
