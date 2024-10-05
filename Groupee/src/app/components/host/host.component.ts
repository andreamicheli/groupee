// host.component.ts

import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Room } from '../../models/room.model';
import { Question } from '../../models/question.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-host',
  standalone: true,
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css'],
  imports: [CommonModule],
})
export class HostComponent implements OnInit {
  roomId: string = '';
  room: Room | undefined;
  participantLink: string = '';
  questions: Question[] = [];
  private authSubscription: Subscription | undefined;
  private roomSubscription: Subscription | undefined;
  private questionsSubscription: Subscription | undefined;

  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    // Subscribe to the current user's ID
    this.authSubscription = this.authService.currentUserId$
      .pipe(filter((uid): uid is string => uid !== null)) // Filter out null values
      .subscribe((uid: string) => {
        // Create a new room for the authenticated user
        this.createRoom(uid);
      });
  }

  /**
   * Creates a new room using the provided hostId.
   * @param hostId - The ID of the host creating the room.
   */
  createRoom(hostId: string): void {
    this.roomService.createRoom(hostId).then((generatedRoomId) => {
      this.roomId = generatedRoomId; // Assign the generated room ID
      this.participantLink = `${window.location.origin}/participant/${this.roomId}`;
      this.subscribeToRoom();
    }).catch((error) => {
      console.error('Error creating room:', error);
    });
  }

  /**
   * Subscribes to updates for the current room.
   */
  subscribeToRoom(): void {
    if (this.roomId) {
      this.roomSubscription = this.roomService.getRoom(this.roomId).subscribe((room) => {
        if (room) {
          // Update current question if index changed
          if (
            this.questions.length > 0 &&
            this.room &&
            room.currentQuestionIndex !== this.room.currentQuestionIndex
          ) {
            this.updateCurrentQuestion();
          }
  
          this.room = room;
        } else {
          console.error('Room not found');
        }
      });
    }
  }

  updateCurrentQuestion() {
    if (
      this.room &&
      this.questions.length > 0 &&
      this.room.currentQuestionIndex !== undefined &&
      this.room.currentQuestionIndex < this.questions.length
    ) {
      // No need to store currentQuestion if you're using getCurrentQuestion()
      // But you can update any other state here if necessary
      console.log('Current question updated:', this.getCurrentQuestion());
    }
  }

  /**
   * Fetches questions from Firestore and starts the questionnaire.
   */
  startQuestionnaire(): void {
    this.questionsSubscription = this.firestore
      .collection<Question>('questions', (ref) => ref.orderBy('order'))
      .valueChanges()
      .subscribe(
        (questions) => {
          this.questions = questions;
          console.log('Questions fetched:', this.questions); // Debugging
          this.roomService.startQuestionnaire(this.roomId);
        },
        (error) => {
          console.error('Error fetching questions:', error);
        }
      );
  }

  /**
   * Moves to the next question in the questionnaire.
   */
  nextQuestion(): void {
    if (this.room && this.room.currentQuestionIndex + 1 < this.questions.length) {
      this.roomService.incrementQuestionIndex(this.roomId);
    } else {
      this.endQuestionnaire();
    }
  }

  /**
   * Ends the questionnaire.
   */
  endQuestionnaire(): void {
    this.roomService.endQuestionnaire(this.roomId);
  }

  /**
   * Retrieves the current question based on the currentQuestionIndex.
   * @returns The current Question object.
   */
  getCurrentQuestion(): Question | undefined {
    if (this.room) {
      return this.questions[this.room.currentQuestionIndex];
    }
    return undefined;
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.authSubscription?.unsubscribe();
    this.roomSubscription?.unsubscribe();
    this.questionsSubscription?.unsubscribe();
  }
}
