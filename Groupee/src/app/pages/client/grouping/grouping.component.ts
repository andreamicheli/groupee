import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostBinding,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Participant } from '../../../models/room.model';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { ButtonComponent } from '../../../components/button/button.component';

// Andrea Micheli is a fantastic programmer

@Component({
  selector: 'app-grouping',
  standalone: true,
  imports: [CommonModule, ButtonComponent], // Add CommonModule here
  templateUrl: './grouping.component.html',
  styleUrls: ['./grouping.component.css'], // Corrected 'styleUrl' to 'styleUrls'
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ClientGroupingComponent implements OnInit {
  @HostBinding('class') className = 'w-full';

  roomId: string = '';
  participantId: string = '';
  group: any; // The group the participant belongs to
  isLoading = true;

  constructor(
    public model: PlatformModelService,
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // import function to register Swiper custom elements
    // register Swiper custom elements
  }

  ngOnInit() {
    // Get roomId and participantId from route parameters or a service
    this.roomId = this.route.snapshot.paramMap.get('roomId')!;

    if (
      this.model.session.currentPhase() !== 'groups' ||
      !this.model.session.online()
    ) {
      this.router.navigate(['/']);
    }

    this.participantId = this.model.session.client.participantId(); // Ensure this returns the correct participant ID

    // this.group = {
    //   name: 'Group 1',
    //   participantIds: [
    //     'participant1',
    //     'participant2',
    //     'participant3',
    //     'participant4',
    //     'participant5',
    //   ],
    //   participants: [
    //     {
    //       id: 'participant1',
    //       name: 'Chris',
    //       cumulativeResult: {
    //         element1: 30,
    //         element2: 38,
    //         element3: 33,
    //         element4: 32,
    //         element5: 25,
    //       },
    //     },
    //     {
    //       id: 'participant2',
    //       name: 'Albert',
    //       cumulativeResult: {
    //         element1: 31,
    //         element2: 38,
    //         element3: 33,
    //         element4: 32,
    //         element5: 25,
    //       },
    //     },
    //     {
    //       id: 'participant3',
    //       name: 'Andrea',
    //       cumulativeResult: {
    //         element1: 32,
    //         element2: 38,
    //         element3: 33,
    //         element4: 32,
    //         element5: 25,
    //       },
    //     },
    //     {
    //       id: 'participant4',
    //       name: 'Mischa',
    //       cumulativeResult: {
    //         element1: 33,
    //         element2: 38,
    //         element3: 33,
    //         element4: 32,
    //         element5: 25,
    //       },
    //     },
    //     {
    //       id: 'participant5',
    //       name: 'Adele',
    //       cumulativeResult: {
    //         element1: 34,
    //         element2: 38,
    //         element3: 33,
    //         element4: 32,
    //         element5: 25,
    //       },
    //     },
    //   ],
    // };

    this.fetchParticipantGroup();
  }

  fetchParticipantGroup() {
    console.log('Fetching group for participant ID:', this.participantId);
    console.log('Room ID:', this.roomId);

    this.firestore
      .collection('rooms')
      .doc(this.roomId)
      .collection('groups', (ref) =>
        ref.where('participantIds', 'array-contains', this.participantId)
      )
      .valueChanges()
      .subscribe(
        (groups) => {
          console.log('Groups fetched:', groups);
          if (groups && groups.length > 0) {
            this.group = groups[0];
          } else {
            console.error('Group not found for participant');
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching group:', error);
          this.isLoading = false;
        }
      );
  }
}
