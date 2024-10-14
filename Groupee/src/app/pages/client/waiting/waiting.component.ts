import { Component, DoCheck, HostBinding, OnInit } from '@angular/core';
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
export class ClientWaitingComponent implements OnInit, DoCheck {
  @HostBinding('class') className = 'w-full';

  sessionCode: string = '';

  constructor(
    public model: PlatformModelService,
    private router: Router,
    private route: ActivatedRoute,
    private participantService: ParticipantService
  ) {}

  ngDoCheck() {
    if (this.model.session.currentPhase() === 'questions') {
      this.participantService.loadQuestions();
      // this.router.navigate([`client/${this.model.session.roomId()}/question`], {
      //   replaceUrl: true,
      // });
      // console.log('Navigating to questions ', this.router.routerState.snapshot);
    }
  }

  ngOnInit() {
    if (!this.model.session.online()) {
      console.log('No online session');

      this.router.navigate([[`client/code`]], { replaceUrl: true });
    }
  }
}
