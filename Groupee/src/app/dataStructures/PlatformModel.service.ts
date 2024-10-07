import { Injectable, signal } from '@angular/core';
import { Question } from '../models/question.model';
import { Participant } from '../models/room.model';

@Injectable({
  providedIn: 'root', // Ensures a single instance across the app
})
export class PlatformModelService {
  // Mode to switch between host and client views
  mode = signal<'host' | 'client'>('client'); // Default to 'client'; update as needed

  // General information of the session
  session = {
    online: signal<boolean>(false),
    participantLink: signal<string>(''),
    roomId: signal<string>(''),
    title: signal<string>(''), // Used for host, can be left blank for client
    currentQuestionIndex: signal<number>(-1), // Used for host, can be ignored by client
    currentPhase: signal<null | 'waiting' | 'questions' | 'tree' | 'groups'>(
      null
    ),
    currentAnswers: signal<null | number>(null), // Relevant for host, can be ignored by client
    participants: signal<Array<Participant>>([]),
    client: {
      participantName: signal<string>(''), // Relevant for client, can be ignored by host
      participantId: signal<string>(''),
    }, // Relevant for client, can be ignored by host
  };

  // Settings for the group created, shared across host and client
  groupSettings = {
    groupsNumber: signal<'auto' | number>('auto'), // Used by host, optional for client
    clientsInGroup: signal<'auto' | number>('auto'), // Used by host, optional for client
    extraQuestions: signal<
      Array<{
        title: string;
        type: 'radio' | 'checkbox' | 'likert';
        diversify: boolean;
        options: Array<{
          text: string;
          value: any; // Define as necessary
        }>;
      }>
    >([]), // Custom questions added by host, relevant to both host and client

    followUp: signal<string>(''), // Optional for host, can be ignored by client
    certification: signal<string>(''), // Optional for host, can be ignored by client

    groups: signal<null | Array<
      Array<{
        id: number;
        name: string;
        surname: string;
      }>
    >>(null), // Host-defined groups, relevant for client when viewing groups
  };

  // Questions only relevant to the client
  standardQuestions = signal<Array<Question>>([]);
  // standardQuestions = signal<Array<{
  //   title: string;
  //   type: 'radio' | 'checkbox' | 'likert';
  //   options: Array<{
  //     id: number;
  //     text: string;
  //     value: any; // Define as necessary
  //   }>;
  // }>>([]);

  // Skill tree relevant to both client and host
  skillTree = signal<null | Array<{
    id: number;
    name: string;
    description: string;
    connectionsId: number[];
    icon: string;
  }>>(null);

  // Role specifics, relevant to both client and host
  role = signal<null | {
    title: string;
    description: string;
    image: string;
  }>(null);

  // Group members for both host (viewing) and client (participating)
  group = signal<
    Array<{
      id: number;
      image: string;
      anagraphics: {
        name: string;
        surname: string;
        phone: string | number;
        email: string;
      };
      role: any; // Define as necessary
      description: string;
      skillTree: any; // Define as necessary
    }>
  >([]);
}
