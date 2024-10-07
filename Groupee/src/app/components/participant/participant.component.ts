import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlatformModelService } from '../../dataStructures/PlatformModel.service';
import { ParticipantService } from '../../services/participant.service';

@Component({
  selector: 'app-participant',
  standalone: true,
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ParticipantComponent implements OnInit {
  selectedOption: string = '';
  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private authService: AuthService,
    public model: PlatformModelService,
    private participantService: ParticipantService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    // Subscribe to the current user's ID
    this.participantService.subscribeAuth(); //implemented in participant/code first credentials=false phase
  }

  joinRoom(name: string) {
    this.participantService.joinRoom(name); //implemented in participant/code second credentials=true phase
  }

  submitAnswer(selectedOption: string) {
    this.participantService.submitAnswer(selectedOption);
  }
}
