import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from './room.service';
import { AuthService } from './auth.service';
import { PlatformModelService } from '../dataStructures/PlatformModel.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  delay,
  filter,
  finalize,
  firstValueFrom,
  retryWhen,
  Subject,
  Subscription,
  take,
  takeUntil,
} from 'rxjs';
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
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  private unsubscribe$ = new Subject<void>(); //needed to unsubscribe from observables and avoid navigation issues

  subscribeAuth(): void {
    // this.authSubscription = this.authService.currentUserId$
    this.authService.currentUserId$
      .pipe(
        filter((uid): uid is string => uid !== null),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((uid: string) => {
        this.model.session.client.participantId.set(uid);
        // Now proceed with setting roomId and subscribing to room updates
        this.initializeParticipant();
      });
  }

  initializeParticipant(): void {
    if (this.model.session.roomId()) {
      // this.roomSubscription = this.roomService
      this.roomService
        .getRoom(this.model.session.roomId())
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (room) => {
            if (room) {
              this.roomService.updateModel(room);
            } else {
              console.error('Room not found');
            }
          },
          error: (error) => console.error('Error fetching room:', error),
        });
    }

    // this.roomService
    //   .getParticipant(
    //     this.model.session.roomId(),
    //     this.model.session.client.participantId()
    //   )
    //   .subscribe({
    //     next: (participants) => {
    //       console.log('Participants updated:', participants);
    //       this.model.session.client.participantId.set(participants);
    //     },
    //     error: (error) => {
    //       console.error('Error fetching participants:', error);
    //     },
    //   });
  }

  joinRoom(name: string): void {
    this.model.session.client.participantName.set(name);
    const participant: Participant = {
      participantId: this.model.session.client.participantId(),
      name: this.model.session.client.participantName(),
      cumulativeResult: this.model.session.client.cumulativeResult(),
    };

    // this.roomSubscription = this.roomService
    this.roomService
      .addParticipant(this.model.session.roomId(), participant)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.router.navigate([
            `/client/${this.model.session.roomId()}/waiting`,
          ]);
          this.model.session.currentPhase.set('waiting');
        },
        error: (error) => {
          console.error('Error adding participant:', error);
        },
      });
  }

  loadQuestions() {
    // this.roomSubscription = this.roomService
    this.roomService
      .getQuestions()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (questions) => {
          this.model.standardQuestions.set(questions);
          this.questionsLoaded = true;
          console.log('Questions loaded:', questions);
          this.router.navigate(
            [`client/${this.model.session.roomId()}/question`],
            {
              replaceUrl: true,
            }
          );
        },
        error: (error) => {
          console.error('Error fetching questions:', error);
        },
      });
  }

  submitAnswer(selectedOption: string) {
    if (this.model.session.online() && this.model.session.roomId()) {
      // this.roomSubscription = this.roomService
      this.roomService
        .submitAnswer(
          this.model.session.roomId(),
          this.model.session.client.participantId(),
          selectedOption,
          this.model.session.currentQuestionIndex()
        )
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe();
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
