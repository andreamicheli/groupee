import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Room, Participant, CumulativeResult } from '../models/room.model';
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
      isQuestionnaireActive: false,
      currentQuestionIndex: -1,
      isQuestionnairEnded: false,
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
    console.log('Fetching room with ID:', roomId);
    return this.firestore.collection<Room>('rooms').doc(roomId).valueChanges();
  }

  addParticipant(roomId: string, participant: Participant): Promise<void> {
  if (!roomId) {
    console.error('addParticipant called with empty roomId');
    return Promise.reject('roomId is required');
  }
  if (!participant.participantId) {
    console.error('addParticipant called with empty participantId');
    return Promise.reject('participantId is required');
  }

  console.log('Adding participant with ID:', participant.participantId, 'to room:', roomId);

  const participantRef = this.firestore
    .collection('rooms')
    .doc(roomId)
    .collection('participants')
    .doc(participant.participantId);

  return participantRef.set(participant);
}
  
  updateParticipantCumulativeResult(
    roomId: string,
    participantId: string,
    optionValues: CumulativeResult
  ): Promise<void> {
    const participantRef = this.firestore
      .collection('rooms')
      .doc(roomId)
      .collection('participants')
      .doc(participantId);
  
    return this.firestore.firestore.runTransaction(async (transaction) => {
      const participantDoc = await transaction.get(participantRef.ref);
  
      if (!participantDoc.exists) {
        throw new Error('Participant does not exist');
      }
  
      const participantData = participantDoc.data() as Participant;
  
      // Initialize cumulativeResult if not present
      if (!participantData.cumulativeResult) {
        participantData.cumulativeResult = {
          element1: 0,
          element2: 0,
          element3: 0,
          element4: 0,
          element5: 0,
        };
      }
  
      // Update cumulativeResult
      participantData.cumulativeResult.element1 += optionValues.element1;
      participantData.cumulativeResult.element2 += optionValues.element2;
      participantData.cumulativeResult.element3 += optionValues.element3;
      participantData.cumulativeResult.element4 += optionValues.element4;
      participantData.cumulativeResult.element5 += optionValues.element5;
  
      // Update the participant document
      transaction.update(participantRef.ref, participantData);
    });
  }
  

  endQuestionnaire(roomId: string) {
    return this.firestore.collection('rooms').doc(roomId).update({
      isQuestionnaireActive: false,
      isQuestionnaireEnded: true,
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

  getParticipants(roomId: string): Observable<Participant[]> {
    return this.firestore
      .collection('rooms')
      .doc(roomId)
      .collection<Participant>('participants')
      .valueChanges();
  }
  
  getParticipant(roomId: string, participantId: string): Observable<Participant | undefined> {
    if (!roomId || !participantId) {
      console.error('getParticipant called with empty roomId or participantId');
      return of(undefined);
    }
    return this.firestore
      .collection('rooms')
      .doc(roomId)
      .collection<Participant>('participants')
      .doc(participantId)
      .valueChanges();
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
