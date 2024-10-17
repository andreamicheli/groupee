// export enum ParticipantState {
//   WaitingForQuestion,
//   ViewingQuestion,
//   WaitingForNextQuestion,
//   QuestionnaireFinished,
// }

// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { RoomService } from '../../services/room.service';
// import { AuthService } from '../../services/auth.service';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { filter, first, switchMap } from 'rxjs/operators';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-participant',
//   standalone: true,
//   templateUrl: './participant.component.html',
//   styleUrls: ['./participant.component.css'],
//   imports: [CommonModule, FormsModule],
// })
// export class ParticipantComponent implements OnInit {
//   selectedOption: string = '';
//   questionsLoaded: boolean = false;
//   questionAnswered: boolean = false;

//   participantState: ParticipantState = ParticipantState.WaitingForQuestion;

//   ParticipantState = ParticipantState;
//   // New property to hold the participant's data
//   participant: Participant | undefined;
//   private participantSubscription: Subscription | undefined;
//   private roomSubscription: Subscription | undefined;
//   private questionsSubscription: Subscription | undefined;
//   private authSubscription: Subscription | undefined;

//   constructor(
//     private route: ActivatedRoute,
//     private roomService: RoomService,
//     private authService: AuthService,
//     public model: PlatformModelService,
//     private participantService: ParticipantService,
//     private firestore: AngularFirestore
//   ) {}

//   ngOnInit(): void {
//     const roomIdFromRoute = this.route.snapshot.paramMap.get('roomId');
//     if (!roomIdFromRoute) {
//       console.error('No roomId found in route parameters');
//       // Handle error (e.g., redirect or display a message)
//       return;
//     }
//     this.roomId = roomIdFromRoute;

//     // Subscribe to the current user's ID
//     this.authService.currentUserId$
//       .pipe(filter((uid): uid is string => uid !== null))
//       .subscribe((uid: string) => {
//         this.participantId = uid;
//         // Now proceed with setting roomId and subscribing to room updates
//         this.initializeParticipant();
//       });
//   }

//   initializeParticipant(): void {
//     if (!this.roomId || !this.participantId) {
//       console.error('roomId or participantId is undefined');
//       return;
//     }

//     this.roomSubscription = this.roomService.getRoom(this.roomId).subscribe(
//       (room) => {
//         if (room) {
//           // Store previous state before updating this.room
//           const previousQuestionIndex = this.room?.currentQuestionIndex;
//           const wasQuestionnaireActive = this.room?.isQuestionnaireActive;

//           this.room = room;
//           console.log('Room data received:', this.room);

//           // Check if questionnaire just became active
//           if (room.isQuestionnaireActive && !this.questionsLoaded) {
//             this.loadQuestions();
//             this.questionsLoaded = true;
//             console.log('Questionnaire started');
//           }

//           // Check if questionnaire has ended
//           if (!room.isQuestionnaireActive && wasQuestionnaireActive) {
//             // Questionnaire has ended
//             this.participantState = ParticipantState.QuestionnaireFinished;
//             console.log('Participant state set to QuestionnaireFinished');
//           }

//           // Update current question if index changed
//           if (
//             this.questions.length > 0 &&
//             room.currentQuestionIndex !== previousQuestionIndex
//           ) {
//             this.updateCurrentQuestion();
//           }
//         } else {
//           console.error('Room not found');
//         }
//       },
//       (error) => {
//         console.error('Error fetching room:', error);
//       }
//     );

//     // Subscribe to participant's data
//     this.participantSubscription = this.roomService
//       .getParticipant(this.roomId, this.participantId)
//       .subscribe((participant) => {
//         this.participant = participant;
//         console.log('Participant data received:', this.participant);
//       });
//   }

//   joinRoom(name: string): void {
//     if (!this.roomId || !this.participantId) {
//       console.error('roomId or participantId is undefined');
//       return;
//     }

//     this.participantName = name;
//     console.log('Participant name set to:', this.participantName);

//     const participant: Participant = {
//       participantId: this.participantId,
//       name: this.participantName,
//       cumulativeResult: {
//         element1: 0,
//         element2: 0,
//         element3: 0,
//         element4: 0,
//         element5: 0,
//       },
//     };

//     this.roomService
//       .addParticipant(this.roomId, participant)
//       .then(() => {
//         console.log('Participant added successfully:', participant);

//         // Set initial state based on questionnaire status
//         if (this.room?.isQuestionnaireActive) {
//           this.participantState = ParticipantState.ViewingQuestion;
//           console.log('Participant state set to ViewingQuestion');
//         } else if (this.room?.isQuestionnaireEnded == false){
//           this.participantState = ParticipantState.WaitingForQuestion;
//           console.log('Participant state set to WaitingForQuestion');
//         }
//       })
//       .catch((error) => {
//         console.error('Error adding participant:', error);
//       });
//   }

//   loadQuestions(): void {
//     this.questionsSubscription = this.firestore
//       .collection<Question>('questions', (ref) => ref.orderBy('order'))
//       .valueChanges({ idField: 'questionId' })
//       .subscribe(
//         (questions) => {
//           this.questions = questions;
//           console.log('Questions fetched:', this.questions);

//           // Start the questionnaire in the participant's view
//           this.updateCurrentQuestion();
//         },
//         (error) => {
//           console.error('Error fetching questions:', error);
//         }
//       );
//   }

//   updateCurrentQuestion(): void {
//     console.log('Updating current question...');
//     if (
//       this.room &&
//       this.questions.length > 0 &&
//       this.room.currentQuestionIndex !== undefined
//     ) {
//       if (this.room.currentQuestionIndex < this.questions.length) {
//         this.currentQuestion = this.questions[this.room.currentQuestionIndex];
//         console.log('Current question set:', this.currentQuestion);

//         // Update participant state to ViewingQuestion
//         this.participantState = ParticipantState.ViewingQuestion;
//         console.log('Participant state set to ViewingQuestion');
//       } else {
//         // No more questions; questionnaire finished
//         this.currentQuestion = undefined;
//         this.participantState = ParticipantState.QuestionnaireFinished;
//         console.log('Participant state set to QuestionnaireFinished');
//       }
//     } else {
//       this.currentQuestion = undefined;
//       this.participantState = ParticipantState.WaitingForQuestion;
//       console.log('Participant state set to WaitingForQuestion');
//     }
//   }

//   submitAnswer(): void {
//     if (this.room && this.participantId && this.currentQuestion) {
//       const selectedOptionText = this.selectedOption;

//       // Find the selected option
//       const selectedOption = this.currentQuestion.options.find(
//         (option) => option.text === selectedOptionText
//       );

//       if (selectedOption) {
//         const optionValues = selectedOption.values;

//         // Update the participant's cumulative result
//         this.roomService
//           .updateParticipantCumulativeResult(
//             this.roomId,
//             this.participantId,
//             optionValues
//           )
//           .then(() => {
//             // Success
//             this.selectedOption = '';

//             // Update participant state to WaitingForNextQuestion
//             this.participantState = ParticipantState.WaitingForNextQuestion;
//             console.log('Participant state set to WaitingForNextQuestion');
//           })
//           .catch((error) => {
//             console.error('Error updating cumulative result:', error);
//           });
//       } else {
//         console.error('Selected option not found in the current question.');
//       }
//     } else {
//       console.error('Room data or participant ID is not available');
//     }
//   }

//   ngOnDestroy(): void {
//     this.authSubscription?.unsubscribe();
//     this.roomSubscription?.unsubscribe();
//     this.questionsSubscription?.unsubscribe();
//     this.participantSubscription?.unsubscribe();
//   }
// }
