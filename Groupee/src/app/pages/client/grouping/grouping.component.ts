import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Participant } from '../../../models/room.model';

@Component({
  selector: 'app-grouping',
  standalone: true,
  imports: [],
  templateUrl: './grouping.component.html',
  styleUrl: './grouping.component.css'
})
export class ClientGroupingComponent implements OnInit {
  roomId: string = "";
  participantId: string = "";
  group: any; // The group the participant belongs to
  isLoading = true;

  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Get roomId and participantId from route parameters or a service
    this.roomId = this.route.snapshot.paramMap.get('roomId')!;
    this.participantId = 'currentParticipantId'; // Retrieve this from authentication or a service

    this.fetchParticipantGroup();
  }

  fetchParticipantGroup() {
    this.firestore.collection('rooms').doc(this.roomId)
      .collection('groups', ref => ref.where('participantIds', 'array-contains', this.participantId))
      .valueChanges()
      .subscribe(groups => {
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