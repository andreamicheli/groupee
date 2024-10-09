import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { ParticipantService } from '../../../services/participant.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  inputTouched: boolean = false;

  constructor(
    public model: PlatformModelService,
    private router: Router,
    private participantService: ParticipantService
  ) {}

  toCredentials() {
    this.model.session.roomId.set(this.sessionCode);
    this.participantService.subscribeAuth();
    this.router.navigate([`client/${this.sessionCode}/credentials`], {
      replaceUrl: true,
    });
  }

  onInputTouched() {
    this.inputTouched = true;
  }
}
