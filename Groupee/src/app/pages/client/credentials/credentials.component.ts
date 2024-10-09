import { Component, HostBinding } from '@angular/core';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { ParticipantService } from '../../../services/participant.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-client-credentials',
  standalone: true,
  imports: [FormsModule, CommonModule],

  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.css',
})
export class ClientCredentialsComponent implements OnInit {
  @HostBinding('class') className = 'w-full';

  userName: string = '';

  constructor(
    public model: PlatformModelService,
    private participantService: ParticipantService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const roomId = this.route.snapshot.paramMap.get('roomId');
    if (roomId?.length == 20) {
      if (this.model.session.online() && this.model.session.roomId()) {
        return;
      } else {
        this.model.session.roomId.set(roomId);
        this.participantService.subscribeAuth();
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  joinRoom() {
    this.participantService.joinRoom(this.userName);
  }
}
