import { Injectable } from '@angular/core';
import { Room } from '../models/room.model';
import { Question } from '../models/question.model';
import { filter, Subscription } from 'rxjs';
import { RoomService } from './room.service';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PlatformModelService } from '../dataStructures/PlatformModel.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HostService {
  private authSubscription: Subscription | undefined;
  private roomSubscription: Subscription | undefined;
  private questionsSubscription: Subscription | undefined;

  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private model: PlatformModelService,
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  subscribeAuth(): void {
    this.authSubscription = this.authService.currentUserId$
      .pipe(filter((uid): uid is string => uid !== null)) // Filter out null values
      .subscribe((uid: string) => {
        // Create a new room for the authenticated user
        this.createRoom(uid);
      });
  }

  createRoom(hostId: string): void {
    this.roomService
      .createRoom(hostId)
      .then((generatedRoomId) => {
        this.model.session.roomId.set(generatedRoomId); // Assign the generated room ID
        this.model.session.participantLink.set(
          `/client/${this.model.session.roomId()}/credentials`
        );
        this.subscribeToRoom();
      })
      .catch((error) => {
        console.error('Error creating room:', error);
      });
  }

  subscribeToRoom(): void {
    if (this.model.session.roomId()) {
      this.roomSubscription = this.roomService
        .getRoom(this.model.session.roomId())
        .subscribe((room) => {
          if (room) {
            console.log('firebase fethed room', room);
            // Update current question if index changed
            if (
              this.model.standardQuestions().length > 0 &&
              room &&
              room.currentQuestionIndex !== room.currentQuestionIndex
            ) {
              this.updateCurrentQuestion();
            }
            this.roomService.updateModel(room);
            this.model.session.currentPhase.set('waiting');
            this.router.navigate([
              `host/${this.model.session.roomId()}/waiting`,
            ]);
          } else {
            console.error('Room not found');
          }
        });
    }
  }

  updateCurrentQuestion() {
    if (
      this.model.session.online() &&
      this.model.standardQuestions().length > 0 &&
      this.model.session.currentQuestionIndex() <
        this.model.standardQuestions().length
    ) {
      // No need to store currentQuestion if you're using getCurrentQuestion()
      // But you can update any other state here if necessary
      console.log('Current question updated:', this.getCurrentQuestion());
    }
  }

  startQuestionnaire(): void {
    this.questionsSubscription = this.firestore
      .collection<Question>('questions', (ref) => ref.orderBy('order'))
      .valueChanges()
      .subscribe(
        (questions) => {
          this.model.standardQuestions.set(questions);
          // console.log('Questions fetched:', this.questions); // Debugging
          this.roomService.startQuestionnaire(this.model.session.roomId());
          this.model.session.currentQuestionIndex.set(0);
          this.model.session.currentPhase.set('questions');
        },
        (error) => {
          console.error('Error fetching questions:', error);
        }
      );
  }

  nextQuestion(): void {
    if (
      this.model.session.online() &&
      this.model.session.currentQuestionIndex() + 1 <
        this.model.standardQuestions().length
    ) {
      this.roomService.incrementQuestionIndex(this.model.session.roomId());
    } else {
      this.endQuestionnaire();
    }
  }

  getCurrentQuestion(): Question {
    return this.model.standardQuestions()[
      this.model.session.currentQuestionIndex()
    ];
  }

  endQuestionnaire(): void {
    this.roomService.endQuestionnaire(this.model.session.roomId());
  }
}
