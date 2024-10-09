import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from './room.service';
import { AuthService } from './auth.service';
import { PlatformModelService } from '../dataStructures/PlatformModel.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { delay, filter, finalize, firstValueFrom, retryWhen, take } from 'rxjs';
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
    this.roomService.getRoom(this.model.session.roomId()).subscribe({
      next: (room) => {
        if (room) {
          this.roomService.updateModel(room);
          if (
            this.router.url ===
            `/client/${this.model.session.roomId()}/credentials`
          ) {
            console.log('Already on the credentials page');
          } else {
            this.router.navigate([
              `/client/${this.model.session.roomId()}/credentials`,
            ]);
          }
        } else {
          console.error('Room not found');
        }
      },
      error: (error) => console.error('Error fetching room:', error),
    });
  }

  private navigationInProgress = false;

  joinRoom(name: string): void {
    if (this.navigationInProgress) return;

    this.navigationInProgress = true;
    this.model.session.client.participantName.set(name);
    const participant: Participant = {
      participantId: this.model.session.client.participantId(),
      name: this.model.session.client.participantName(),
    };

    this.roomService
      .addParticipant(this.model.session.roomId(), participant)
      .pipe(take(1), delay(100))
      .subscribe({
        next: () => {
          this.router.navigate([
            `/client/${this.model.session.roomId()}/waiting`,
          ]);
          this.model.session.currentPhase.set('waiting');
        },
        error: (error) => {
          console.error('Error adding participant:', error);
          this.navigationInProgress = false; // Reset flag on error
        },
        complete: () => {
          this.navigationInProgress = false; // Reset flag on completion
        },
      });
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
