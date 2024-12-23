import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Room,
  Participant,
  CumulativeResult,
  ParticipantState,
} from '../models/room.model';
import firebase from 'firebase/compat/app';
import { from, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PlatformModelService } from '../dataStructures/PlatformModel.service';
import { Question } from '../models/question.model';

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
      isQuestionnaireActive: false,
      currentQuestionIndex: -1,
      isQuestionnaireEnded: false,
      // participants: [],
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
    console.log('Fetching room with ID:', roomId);
    return this.firestore.collection<Room>('rooms').doc(roomId).valueChanges();
  }

  addParticipant(roomId: string, participant: Participant): Observable<void> {
    const participantRef = this.firestore
      .collection('rooms')
      .doc(roomId)
      .collection('participants')
      .doc(participant.participantId);

    return from(participantRef.set(participant));
  }

  getQuestions(): Observable<Question[]> {
    return this.firestore
      .collection<Question>('questions', (ref) => ref.orderBy('order'))
      .valueChanges();
  }

  updateParticipantCumulativeResult(
    roomId: string,
    participantId: string,
    optionValues: CumulativeResult
  ): Observable<void> {
    const participantRef = this.firestore
      .collection('rooms')
      .doc(roomId)
      .collection('participants')
      .doc(participantId);

    const transactionPromise = this.firestore.firestore.runTransaction(
      async (transaction) => {
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
      }
    );

    return from(transactionPromise);
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
    return this.firestore
      .collection('rooms')
      .doc(roomId)
      .update({
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

  getParticipant(
    roomId: string,
    participantId: string
  ): Observable<Participant | undefined> {
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
    answer: number,
    questionIndex: number
  ): Observable<void> {
    if (!roomId || !participantId) {
      console.error('submitAnswer called with empty roomId or participantId');
      return of(undefined);
    }
    const roomRef = this.firestore.collection('rooms').doc(roomId);
    const participantAnswerPath = `participantAnswers.${participantId}.${questionIndex}`;
    const updateData = {
      [participantAnswerPath]: answer, // I'm sending here the id of the option answered
    };
    return from(roomRef.update(updateData)).pipe(
      catchError((error) => {
        console.error('Error submitting answer:', error);
        throw error;
      }),
      // Update the model after successfully storing the data in Firebase
      tap(() => {
        // Update the currentAnswers signal with the new answer
        const currentAnswersValue = this.model.session.currentAnswers();

        // Initialize the participant's answers if not present
        if (!currentAnswersValue[participantId]) {
          currentAnswersValue[participantId] = {};
        }

        // Update the specific question index with the new answer
        currentAnswersValue[participantId][questionIndex] = String(answer); // Store as string or as needed
        console.log(
          'annswer:',
          answer,
          ' currentAnswersValue:',
          currentAnswersValue
        );

        this.model.session.currentAnswers.set(currentAnswersValue); // Update the signal with new state
      })
    );
  }

  updateModel(room: Room) {
    console.log('model updated!!!');

    const currentQuestionIndexSnapshot =
      this.model.session.currentQuestionIndex();
    this.model.session.participantLink.set(
      `/client/${room.roomId}/credentials`
    );
    if (!room.isQuestionnaireActive && !room.isQuestionnaireEnded)
      this.model.session.currentPhase.set('waiting');
    this.model.session.online.set(true);
    this.model.session.roomId.set(room.roomId);
    //this.model.session.currentAnswers.set(room.participantAnswers);
    this.getParticipants(this.model.session.roomId()).subscribe({
      next: (participants) => {
        this.model.session.participants.set(participants);
      },
    });
    if (room.isQuestionnaireActive)
      this.model.session.currentPhase.set('questions');
    if (room.isQuestionnaireEnded) {
      this.model.session.currentPhase.set('tree');
    }

    this.firestore
      .collection('rooms')
      .doc(room.roomId)
      .collection('groups')
      .snapshotChanges()
      .subscribe((changes) => {
        if (changes.length > 0) {
          this.model.session.currentPhase.set('groups');
        }
      });

    if (currentQuestionIndexSnapshot !== room.currentQuestionIndex) {
      this.model.session.currentQuestionIndex.set(room.currentQuestionIndex);
      this.model.session.client.participantState.set(
        ParticipantState.ViewingQuestion
      );
    }
    this.model.session.currentAnswers.set(room.participantAnswers);
    console.log(this.model);
    // this.model.session.currentAnswers.set(
    //   Object.keys(room.participantAnswers).length
    // );
  }

  // Additional methods will be added later
}
