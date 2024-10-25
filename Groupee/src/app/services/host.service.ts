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
          // Define ParticipantData and Group interfaces
          interface ParticipantData {
            participantId: string;
            name: string;
            variables: number[]; // Array of 5 numbers between 1 and 10
          }

          interface Group {
            id: string; // Use string IDs for Firestore document IDs
            name: string; // Random group name
            participants: ParticipantData[];
            totalVariables: number[]; // Sum of variables in the group
          }

          // Array of possible group names
          const groupNames = [
            'Alpha',
            'Beta',
            'Gamma',
            'Delta',
            'Epsilon',
            'Zeta',
            'Eta',
            'Theta',
            'Iota',
            'Kappa',
            'Lambda',
            'Mu',
            'Nu',
            'Xi',
            'Omicron',
            'Pi',
            'Rho',
            'Sigma',
            'Tau',
            'Upsilon',
            'Phi',
            'Chi',
            'Psi',
            'Omega',
          ];

          // Shuffle the group names array to ensure randomness
          const shuffledGroupNames = groupNames.sort(() => 0.5 - Math.random());

          // Map participants to the required format
          const formattedParticipants: ParticipantData[] = participants.map(
            (p: Participant) => ({
              participantId: p.participantId,
              name: p.name,
              variables: [
                p.cumulativeResult.element1,
                p.cumulativeResult.element2,
                p.cumulativeResult.element3,
                p.cumulativeResult.element4,
                p.cumulativeResult.element5,
              ],
            })
          );

          // Determine group size or number of groups
          const groupSize = this.model.groupSettings.clientsInGroup(); // Set your desired group size: ;
          console.log(this.model.groupSettings.groupsNumber());
          const numberOfGroups = Math.ceil(
            formattedParticipants.length / groupSize
          );

          // Initialize groups with random names
          const groups: Group[] = [];
          for (let i = 0; i < numberOfGroups; i++) {
            const groupName =
              shuffledGroupNames[i % shuffledGroupNames.length] ||
              `Group_${i + 1}`;
            groups.push({
              id: `group_${i + 1}`,
              name: groupName,
              participants: [],
              totalVariables: [0, 0, 0, 0, 0],
            });
          }

          // Calculate total variables
          const totalVariables = [0, 0, 0, 0, 0];
          formattedParticipants.forEach((participant) => {
            participant.variables.forEach((value, index) => {
              totalVariables[index] += value;
            });
          });

          // Calculate target variables per group
          const targetVariablesPerGroup = totalVariables.map(
            (total) => total / numberOfGroups
          );

          // Sort participants based on sum of variables (descending)
          formattedParticipants.sort((a, b) => {
            const sumA = a.variables.reduce((acc, val) => acc + val, 0);
            const sumB = b.variables.reduce((acc, val) => acc + val, 0);
            return sumB - sumA;
          });

          // Assign participants to groups
          formattedParticipants.forEach((participant) => {
            let bestGroup: Group | null = null;
            let minimalError = Infinity;

            for (const group of groups) {
              if (group.participants.length >= groupSize) {
                continue; // Skip if group is already full
              }

              // Calculate new total variables if participant is added
              const newTotalVariables = group.totalVariables.map(
                (value, index) => value + participant.variables[index]
              );

              // Calculate error (deviation from target variables)
              const error = newTotalVariables.reduce((acc, value, index) => {
                const deviation = Math.abs(
                  value - targetVariablesPerGroup[index]
                );
                return acc + deviation;
              }, 0);

              if (error < minimalError) {
                minimalError = error;
                bestGroup = group;
              }
            }

            if (bestGroup) {
              bestGroup.participants.push(participant);
              bestGroup.totalVariables = bestGroup.totalVariables.map(
                (value, index) => value + participant.variables[index]
              );
            } else {
              console.error(
                'Unable to assign participant:',
                participant.participantId
              );
            }
          });

          // Store each group as a document in the 'groups' subcollection inside the room document
          const roomDocRef = this.firestore
            .collection('rooms')
            .doc(this.model.session.roomId());

          const batch = this.firestore.firestore.batch(); // Use Firestore batch for atomic writes

          groups.forEach((group) => {
            const groupDocRef = roomDocRef.collection('groups').doc(group.id);

            const groupData = {
              name: group.name,
              participants: group.participants.map((p) => ({
                participantId: p.participantId,
                name: p.name,
              })),
              participantIds: group.participants.map((p) => p.participantId), // Add this line
              totalVariables: group.totalVariables,
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
            .catch((error) => {
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
