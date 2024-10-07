import { Component, HostBinding } from '@angular/core';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { ParticipantService } from '../../../services/participant.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-code',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './code.component.html',
  styleUrl: './code.component.css',
})
export class ClientCodeComponent {
  @HostBinding('class') className = 'w-full';

  sessionCode: string = '';
  userName: string = '';
  credentials: boolean = false;

  constructor(
    public model: PlatformModelService,

    private participantService: ParticipantService
  ) {}

  initializeParticipant() {
    this.model.session.roomId.set(this.sessionCode);
    console.log(this.model.session.roomId());
    this.participantService.subscribeAuth();
    this.credentials = true;
  }

  joinRoom() {
    this.participantService.joinRoom(this.userName);
  }
}
