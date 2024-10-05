import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Room, Participant } from '../models/room.model';
import firebase from 'firebase/compat/app';
import { Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private firestore: AngularFirestore) {}

  createRoom(hostId: string): Promise<string> {
    const roomId = this.firestore.createId();
    const roomData: Room = {
      roomId: roomId,
      hostId: hostId,
      participants: [],
      isQuestionnaireActive: false,
      currentQuestionIndex: -1,
      participantAnswers: {},
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    return this.firestore.collection('rooms').doc(roomId).set(roomData)
      .then(() => roomId)
      .catch((error) => {
        console.error('Error setting room data:', error);
        throw error;
      });
  }

  getRoom(roomId: string): Observable<Room | undefined> {
    if (!roomId) {
      console.error('getRoom called with empty roomId');
      return of(undefined);
    }
    return this.firestore.collection<Room>('rooms').doc(roomId).valueChanges();
  }

  addParticipant(roomId: string, participant: Participant): Promise<void> {
    return this.firestore
      .collection('rooms')
      .doc(roomId)
      .update({
        participants: firebase.firestore.FieldValue.arrayUnion(participant),
      });
  }
  

  endQuestionnaire(roomId: string) {
    return this.firestore.collection('rooms').doc(roomId).update({
      isQuestionnaireActive: false,
    });
  }

  startQuestionnaire(roomId: string): Promise<void> {
    return this.firestore.collection('rooms').doc(roomId).update({
      isQuestionnaireActive: true,
      currentQuestionIndex: 0,
      participantAnswers: {},
    });
  }

  // Move to the next question
  incrementQuestionIndex(roomId: string) {
    return this.firestore.collection('rooms').doc(roomId).update({
      currentQuestionIndex: firebase.firestore.FieldValue.increment(1),
    });
  }

  submitAnswer(
    roomId: string,
    participantId: string,
    answer: string,
    questionIndex: number
  ): Promise<void> {
    if (!roomId || !participantId) {
      console.error('submitAnswer called with empty roomId or participantId');
      return Promise.reject('roomId and participantId are required');
    }
    const roomRef = this.firestore.collection('rooms').doc(roomId);
    const participantAnswerPath = `participantAnswers.${participantId}.${questionIndex}`;
    const updateData = {
      [participantAnswerPath]: answer,
    };
    return roomRef.update(updateData).catch((error) => {
      console.error('Error submitting answer:', error);
      throw error;
    });
  }
  
  // Additional methods will be added later
}
