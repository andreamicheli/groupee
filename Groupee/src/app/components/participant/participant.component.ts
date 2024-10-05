import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Room, Participant} from '../../models/room.model';
import { Question } from '../../models/question.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-participant',
  standalone: true,
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ParticipantComponent implements OnInit {
  roomId: string = '';
  room: Room | undefined;
  participantName: string = '';
  participantId!: string;
  questions: Question[] = [];
  currentQuestion: Question | undefined;
  selectedOption: string = '';
  questionsLoaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    // Subscribe to the current user's ID
    this.authService.currentUserId$
      .pipe(filter((uid): uid is string => uid !== null))
      .subscribe((uid: string) => {
        this.participantId = uid;
        // Now proceed with setting roomId and subscribing to room updates
        this.initializeParticipant();
      });
  }

  initializeParticipant(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomId')!;
    this.roomService.getRoom(this.roomId).subscribe((room) => {
      if (room) {
        // Check if questionnaire just became active
        if (room.isQuestionnaireActive && !this.questionsLoaded) {
          this.loadQuestions();
          this.questionsLoaded = true;
        }
  
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

  joinRoom(name: string) {
    this.participantName = name;
    const participant: Participant = {
      participantId: this.participantId,
      name: this.participantName,
    };
    this.roomService.addParticipant(this.roomId, participant);
  }

  loadQuestions() {
    this.firestore
      .collection<Question>('questions', (ref) => ref.orderBy('order'))
      .valueChanges()
      .subscribe((questions) => {
        this.questions = questions;
        this.updateCurrentQuestion();
      });
  }

  updateCurrentQuestion() {
    if (
      this.room &&
      this.questions.length > 0 &&
      this.room.currentQuestionIndex !== undefined &&
      this.room.currentQuestionIndex < this.questions.length
    ) {
      this.currentQuestion = this.questions[this.room.currentQuestionIndex];
      console.log('Current question updated:', this.currentQuestion); // Debugging
    } else {
      this.currentQuestion = undefined;
    }
  }

  submitAnswer() {
    if (this.room) {
      this.roomService.submitAnswer(
        this.roomId,
        this.participantId,
        this.selectedOption,
        this.room.currentQuestionIndex
      );
      // Clear selection after submission
      //this.selectedOption = null;
    } else {
      console.error('Room data is not available');
    }
  }
  
}
