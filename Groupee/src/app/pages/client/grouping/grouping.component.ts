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
import { MatIconModule } from '@angular/material/icon';

// Andrea Micheli is a fantastic programmer

@Component({
  selector: 'app-grouping',
  standalone: true,
  imports: [CommonModule, ButtonComponent, MatIconModule], // Add CommonModule here
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
  showCopiedMessage = false;

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
    //       participantId: 'participant1',
    //       name: 'Chris',
    //       email: 'andymicheli2000@gmail.com',
    //       phone: '+393357742471',
    //       cumulativeResult: {
    //         element1: 30,
    //         element2: 38,
    //         element3: 33,
    //         element4: 32,
    //         element5: 25,
    //       },
    //     },
    //     {
    //       participantId: 'participant2',
    //       name: 'Albert',
    //       email: 'andymicheli2000@gmail.com',
    //       phone: '+393357742471',
    //       cumulativeResult: {
    //         element1: 31,
    //         element2: 38,
    //         element3: 33,
    //         element4: 32,
    //         element5: 25,
    //       },
    //     },
    //     {
    //       participantId: 'participant3',
    //       name: 'Andrea',
    //       email: 'andymicheli2000@gmail.com',
    //       phone: '+393357742471',
    //       cumulativeResult: {
    //         element1: 32,
    //         element2: 38,
    //         element3: 33,
    //         element4: 32,
    //         element5: 25,
    //       },
    //     },
    //     {
    //       participantId: 'participant4',
    //       name: 'Mischa',
    //       email: 'andymicheli2000@gmail.com',
    //       phone: '+393357742471',
    //       cumulativeResult: {
    //         element1: 33,
    //         element2: 38,
    //         element3: 33,
    //         element4: 32,
    //         element5: 25,
    //       },
    //     },
    //     {
    //       participantId: 'participant5',
    //       name: 'Adele',
    //       email: 'andymicheli2000@gmail.com',
    //       phone: '+393357742471',
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

  cleanId(id: string): number {
    return id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
    this.showCopiedMessage = true;
    setTimeout(() => {
      this.showCopiedMessage = false;
    }, 1000);
  }

  exportContact(participant: Participant | any): void {
    const contact = {
      name: participant.name,
      phone: participant.phone,
      email: participant.email,
    };

    const vCard = `
  BEGIN:VCARD
  VERSION:3.0
  FN:${contact.name}
  TEL:${contact.phone}
  EMAIL:${contact.email}
  END:VCARD
    `;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contact.name}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  toTree() {
    this.router.navigate([`client/${this.model.session.roomId()}/tree`]);
  }

  getRandomImage(id: string): string {
    const numericString = id.replace(/\D/g, '');
    const numericValue = parseInt(numericString, 10);
    const imageIndex = (numericValue % 24) + 1;
    return 'assets/images/hands/' + imageIndex.toString() + '.png';
  }
}
