import { Component, HostBinding, OnInit } from '@angular/core';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService } from '../../../services/participant.service';

@Component({
  selector: 'app-client-waiting',
  standalone: true,
  imports: [],
  templateUrl: './waiting.component.html',
  styleUrl: './waiting.component.css',
})
export class ClientWaitingComponent implements OnInit {
  @HostBinding('class') className = 'w-full';

  constructor(
    public model: PlatformModelService,
    private router: Router,
    private route: ActivatedRoute,
    private participantService: ParticipantService
  ) {}

  ngOnInit() {
    if (!this.model.session.online()) {
      this.router.navigate(['client/code'], { replaceUrl: true });
    }
  }
}
