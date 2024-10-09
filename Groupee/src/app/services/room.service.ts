import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Room, Participant } from '../models/room.model';
import firebase from 'firebase/compat/app';
import { from, Observable, of } from 'rxjs';
import { PlatformModelService } from '../dataStructures/PlatformModel.service';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(
    private firestore: AngularFirestore,
    private model: PlatformModelService
  ) {}

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

    return this.firestore
      .collection('rooms')
      .doc(roomId)
      .set(roomData)
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

  addParticipant(roomId: string, participant: Participant): Observable<void> {
    const updatePromise = this.firestore
      .collection('rooms')
      .doc(roomId)
      .update({
        participants: firebase.firestore.FieldValue.arrayUnion(participant),
      });

    return from(updatePromise);
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
    return this.firestore
      .collection('rooms')
      .doc(roomId)
      .update({
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

  //mainly working only in creation and not following updates
  updateModel(room: Room) {
    this.model.session.participantLink.set(
      `/client/${room.roomId}/credentials`
    );
    this.model.session.currentPhase.set('waiting');
    this.model.session.online.set(true);
    this.model.session.roomId.set(room.roomId);
    this.model.session.participants.set(room.participants);
    this.model.session.currentQuestionIndex.set(room.currentQuestionIndex);
    this.model.session.currentPhase.set(
      room.isQuestionnaireActive ? 'questions' : 'waiting'
    );
    console.log(this.model);
    // this.model.session.currentAnswers.set(
    //   Object.keys(room.participantAnswers).length
    // );
  }

  // Additional methods will be added later
}
