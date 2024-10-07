import { Component, HostBinding } from '@angular/core';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { ParticipantService } from '../../../services/participant.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-credentials',
  standalone: true,
  imports: [FormsModule, CommonModule],

  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.css',
})
export class ClientCredentialsComponent {
  @HostBinding('class') className = 'w-full';

  userName: string = '';

  constructor(
    public model: PlatformModelService,
    private participantService: ParticipantService
  ) {}
  joinRoom() {
    this.participantService.joinRoom(this.userName);
  }
}
