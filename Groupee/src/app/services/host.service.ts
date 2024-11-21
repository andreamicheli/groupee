import { Injectable } from '@angular/core';
import { Participant, Room } from '../models/room.model';
import { Question } from '../models/question.model';
import { delay, filter, map, Subscription, switchMap, take } from 'rxjs';
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
  private answersSubscription: Subscription | undefined;

  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private model: PlatformModelService,
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  unsubscribeAll(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.roomSubscription) {
      this.roomSubscription.unsubscribe();
    }
    if (this.questionsSubscription) {
      this.questionsSubscription.unsubscribe;
    }
    if (this.answersSubscription) {
      this.answersSubscription.unsubscribe;
    }
  }

  subscribeAuth(): void {
    console.log(this.model.groupSettings.clientsInGroup());
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
        this.roomService
          .getParticipants(this.model.session.roomId())
          .subscribe({
            next: (participants) => {
              console.log('Participants updated:', participants);
              this.model.session.participants.set(participants);
            },
            error: (error) => {
              console.error('Error fetching participants:', error);
            },
          });
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
            // if (
            //   this.model.standardQuestions().length > 0 &&
            //   room &&
            //   room.currentQuestionIndex !== room.currentQuestionIndex
            // ) {
            //   this.updateCurrentQuestion();
            // }
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

  checkAnswers(): void {
    if (this.model.session.online()) {
      this.answersSubscription = this.roomService
        .getRoom(this.model.session.roomId())
        .subscribe((room) => {
          console.log('answers fetched');
          if (room) this.roomService.updateModel(room);
        });
    }
  }

  // updateCurrentQuestion() {
  //   if (
  //     this.model.session.online() &&
  //     this.model.standardQuestions().length > 0 &&
  //     this.model.session.currentQuestionIndex() <
  //       this.model.standardQuestions().length
  //   ) {
  //     // No need to store currentQuestion if you're using getCurrentQuestion()
  //     // But you can update any other state here if necessary
  //     console.log('Current question updated:', this.getCurrentQuestion());
  //   }
  // }

  startQuestionnaire(): void {
    this.questionsSubscription = this.roomService
      .getQuestions()
      .pipe(
        take(1),
        delay(100),
        map((questions) => {
          this.model.standardQuestions.set(questions);
          this.roomService.startQuestionnaire(this.model.session.roomId());
          this.model.session.currentQuestionIndex.set(0);
          this.model.session.currentPhase.set('questions');
        }),
        switchMap(() => {
          return this.router.navigate(
            [`host/${this.model.session.roomId()}/question`],
            { replaceUrl: true }
          );
        })
      )
      .subscribe({
        next: (questions) => {
          // Adjust time as needed for testing
          // console.log('Questions fetched:', this.questions); // Debugging
        },
        error: (error) => {
          console.error('Error fetching questions:', error);
        },
      });
  }

  nextQuestion(): void {
    if (
      this.model.session.online() &&
      this.model.session.currentQuestionIndex() + 1 <
        this.model.standardQuestions().length
    ) {
      this.roomService.incrementQuestionIndex(this.model.session.roomId());
      this.model.session.currentQuestionIndex.set(
        this.model.session.currentQuestionIndex() + 1
      );
    } else if (
      this.model.session.currentQuestionIndex() + 1 >=
      this.model.standardQuestions().length
    ) {
      this.endQuestionnaire();
    }
  }

  createGroups(): void {
    this.roomService
      .getParticipants(this.model.session.roomId())
      .pipe(take(1))
      .subscribe((participants: Participant[]) => {
        if (participants.length > 0) {
          interface ParticipantData {
            participantId: string;
            name: string;
            email: string;
            phone: string;
            variables: number[]; // Array of 5 numbers between 1 and 10
          }
  
          interface Group {
            id: string;
            name: string;
            participants: ParticipantData[];
          }
  
          const groupNames = [
            'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon',
            'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa',
            'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron',
            'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon',
            'Phi', 'Chi', 'Psi', 'Omega',
          ];
  
          const formattedParticipants: ParticipantData[] = participants.map(
            (p: Participant) => ({
              participantId: p.participantId,
              name: p.name,
              email: p.email,
              phone: p.phone,
              variables: [
                p.cumulativeResult.element1,
                p.cumulativeResult.element2,
                p.cumulativeResult.element3,
                p.cumulativeResult.element4,
                p.cumulativeResult.element5,
              ],
            })
          );
  
          const groupSize: number =
            this.model.groupSettings.clientsInGroup() > 0
              ? this.model.groupSettings.clientsInGroup()
              : Math.ceil(Math.sqrt(this.model.session.participants().length));
          
          console.log('groupSize', groupSize);
          
          const numberOfGroups = Math.ceil(
            formattedParticipants.length / groupSize
          );
  
          // Initialize groups with random names
          const shuffledGroupNames = groupNames.sort(() => 0.5 - Math.random());
          const groups: Group[] = [];
          for (let i = 0; i < numberOfGroups; i++) {
            const groupName =
              shuffledGroupNames[i % shuffledGroupNames.length] ||
              `Group_${i + 1}`;
            groups.push({
              id: `group_${i + 1}`,
              name: groupName,
              participants: [],
            });
          }
  
          // Calculate the dissimilarity matrix
          const participantCount = formattedParticipants.length;
          const dissimilarityMatrix: number[][] = Array.from(
            { length: participantCount },
            () => Array(participantCount).fill(0)
          );
  
          for (let i = 0; i < participantCount; i++) {
            for (let j = i + 1; j < participantCount; j++) {
              const dissimilarity = formattedParticipants[i].variables.reduce(
                (sum, traitValue, index) =>
                  sum +
                  Math.abs(traitValue - formattedParticipants[j].variables[index]),
                0
              );
              dissimilarityMatrix[i][j] = dissimilarity;
              dissimilarityMatrix[j][i] = dissimilarity;
            }
          }
  
          // Use the dissimilarity matrix to order participants
          // Start with the participant with the highest average dissimilarity
          const averageDissimilarities = formattedParticipants.map((p, index) => {
            const totalDissimilarity = dissimilarityMatrix[index].reduce(
              (sum, val) => sum + val,
              0
            );
            return { index, averageDissimilarity: totalDissimilarity / (participantCount - 1) };
          });
  
          // Sort participants by average dissimilarity in descending order
          averageDissimilarities.sort((a, b) => b.averageDissimilarity - a.averageDissimilarity);
          const startingParticipantIndex = averageDissimilarities[0].index;
  
          const orderedParticipantIndices: number[] = [];
          const assignedIndices = new Set<number>();
          assignedIndices.add(startingParticipantIndex);
          orderedParticipantIndices.push(startingParticipantIndex);
  
          // Build the ordered list to maximize dissimilarity between consecutive participants
          while (assignedIndices.size < participantCount) {
            const lastIndex = orderedParticipantIndices[orderedParticipantIndices.length - 1];
            let maxDissimilarity = -1;
            let nextIndex = -1;
  
            for (let i = 0; i < participantCount; i++) {
              if (assignedIndices.has(i)) continue;
              const dissimilarity = dissimilarityMatrix[lastIndex][i];
              if (dissimilarity > maxDissimilarity) {
                maxDissimilarity = dissimilarity;
                nextIndex = i;
              }
            }
  
            if (nextIndex !== -1) {
              assignedIndices.add(nextIndex);
              orderedParticipantIndices.push(nextIndex);
            } else {
              // If no unassigned participant is found, break the loop
              break;
            }
          }
  
          // Create the ordered list of participants
          const orderedParticipants = orderedParticipantIndices.map(index => formattedParticipants[index]);
  
          // Assign participants to groups based on the ordered list
          let currentGroupIndex = 0;
          for (let i = 0; i < orderedParticipants.length; i++) {
            groups[currentGroupIndex].participants.push(orderedParticipants[i]);
            if (groups[currentGroupIndex].participants.length >= groupSize) {
              currentGroupIndex++;
              if (currentGroupIndex >= groups.length) {
                currentGroupIndex = groups.length - 1; // Assign remaining participants to the last group
              }
            }
          }
  
          // Store each group as a document in the 'groups' subcollection inside the room document
          const roomDocRef = this.firestore
            .collection('rooms')
            .doc(this.model.session.roomId());
  
          const batch = this.firestore.firestore.batch();
  
          groups.forEach(group => {
            const groupDocRef = roomDocRef.collection('groups').doc(group.id);
  
            const groupData = {
              name: group.name,
              participants: group.participants.map(p => ({
                participantId: p.participantId,
                name: p.name,
                email: p.email,
                phone: p.phone,
              })),
              participantIds: group.participants.map(p => p.participantId),
            };
  
            batch.set(groupDocRef.ref, groupData);
          });
  
          // Commit the batch write
          batch
            .commit()
            .then(() => {
              console.log('Groups successfully created and stored in Firebase');
              // Update the session phase and navigate
              this.model.session.currentPhase.set('groups');
              this.router.navigate([
                `host/${this.model.session.roomId()}/groups`,
              ]);
            })
            .catch(error => {
              console.error('Error storing groups in Firebase:', error);
            });
        } else {
          console.error('No participants found to create groups');
        }
      });
  }
  
  
  
  

  endQuestionnaire(): void {
    this.roomService.endQuestionnaire(this.model.session.roomId()).then(() => {
      this.model.session.currentPhase.set('tree');
      this.router.navigate([`host/${this.model.session.roomId()}/tree`]);
    });
  }
}
