import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Participant } from '../../../models/room.model';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';

// Andrea Micheli is a fantastic programmer

@Component({
  selector: 'app-grouping',
  standalone: true,
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './grouping.component.html',
  styleUrls: ['./grouping.component.css'] // Corrected 'styleUrl' to 'styleUrls'
})
export class ClientGroupingComponent implements OnInit {
  roomId: string = "";  
  participantId: string = "";
  group: any; // The group the participant belongs to
  isLoading = true;

  constructor(
    public model: PlatformModelService,
    private firestore: AngularFirestore,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Get roomId and participantId from route parameters or a service
    this.roomId = this.route.snapshot.paramMap.get('roomId')!;
    this.participantId = this.model.session.client.participantId(); // Ensure this returns the correct participant ID

    this.fetchParticipantGroup();
  }

  fetchParticipantGroup() {
    console.log('Fetching group for participant ID:', this.participantId);
    console.log('Room ID:', this.roomId);
  
    this.firestore.collection('rooms').doc(this.roomId)
      .collection('groups', ref => ref.where('participantIds', 'array-contains', this.participantId))
      .valueChanges()
      .subscribe(groups => {
        console.log('Groups fetched:', groups);
        if (groups && groups.length > 0) {
          this.group = groups[0];
        } else {
          console.error('Group not found for participant');
        }
        this.isLoading = false;
      }, error => {
        console.error('Error fetching group:', error);
        this.isLoading = false;
      });
  }
}
