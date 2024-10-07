import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from './room.service';
import { AuthService } from './auth.service';
import { PlatformModelService } from '../dataStructures/PlatformModel.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { filter } from 'rxjs';
import { Participant } from '../models/room.model';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  questionsLoaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private authService: AuthService,
    private model: PlatformModelService,
    private firestore: AngularFirestore
  ) {}

  subscribeAuth(): void {
    this.authService.currentUserId$
      .pipe(filter((uid): uid is string => uid !== null))
      .subscribe((uid: string) => {
        this.model.session.client.participantId.set(uid);
        // Now proceed with setting roomId and subscribing to room updates
        this.initializeParticipant();
      });
  }

  initializeParticipant(): void {
    this.model.session.roomId.set(this.route.snapshot.paramMap.get('roomId')!);
    this.roomService.getRoom(this.model.session.roomId()).subscribe((room) => {
      if (room) {
        // Check if questionnaire just became active
        if (room.isQuestionnaireActive && !this.questionsLoaded) {
          this.loadQuestions();
          this.questionsLoaded = true;
        }

        // Update current question if index changed
        if (
          this.model.standardQuestions().length > 0 &&
          this.model.session.online() &&
          room.currentQuestionIndex !==
            this.model.session.currentQuestionIndex()
        ) {
          this.model.session.currentQuestionIndex.set(
            room.currentQuestionIndex
          );
        }

        this.roomService.updateModel(room);
        // this.room = this.model.session.online();
      } else {
        console.error('Room not found');
      }
    });
  }

  joinRoom(name: string) {
    this.model.session.client.participantName.set(name);
    const participant: Participant = {
      participantId: this.model.session.client.participantId(),
      name: this.model.session.client.participantName(),
    };
    this.roomService.addParticipant(this.model.session.roomId(), participant);
  }

  loadQuestions() {
    this.firestore
      .collection<Question>('questions', (ref) => ref.orderBy('order'))
      .valueChanges()
      .subscribe((questions) => {
        this.model.standardQuestions.set(questions);
        // this.updateCurrentQuestion();
      });
  }

  submitAnswer(selectedOption: string) {
    if (this.model.session.online() && this.model.session.roomId()) {
      this.roomService.submitAnswer(
        this.model.session.roomId(),
        this.model.session.client.participantId(),
        selectedOption,
        this.model.session.currentQuestionIndex()
      );
      // Clear selection after submission
      //this.selectedOption = null;
    } else {
      console.error('Room data is not available');
    }
  }

  // updateCurrentQuestion() {
  //   if (
  //     this.model.session.online() &&
  //     this.model.standardQuestions().length > 0 &&
  //     this.model.session.currentQuestionIndex() <
  //       this.model.standardQuestions().length
  //     // this.room.currentQuestionIndex !== undefined &&
  //   ) {
  //     this.model.session.currentQuestionIndex.set()
  //       this.model.standardQuestions()[
  //         this.model.session.currentQuestionIndex()
  //       ];
  //     console.log('Current question updated:', this.currentQuestion); // Debugging
  //   } else {
  //     this.currentQuestion = undefined;
  //   }
  // }
}
