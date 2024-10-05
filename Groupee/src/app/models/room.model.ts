import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


export interface Participant {
    participantId: string;
    name: string;
  }
  
  export interface Room {
    roomId: string;
    hostId: string;
    participants: Participant[];
    isQuestionnaireActive: boolean;
    currentQuestionIndex: number;
    participantAnswers: {
      [participantId: string]: {
        [questionIndex: number]: string;
      };
    };
    createdAt: firebase.firestore.FieldValue | Date;
  }
  