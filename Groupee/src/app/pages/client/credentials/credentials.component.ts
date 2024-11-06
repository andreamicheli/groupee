import { Component, HostBinding, OnInit } from '@angular/core';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { ParticipantService } from '../../../services/participant.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../components/button/button.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-client-credentials',
  standalone: true,
  imports: [FormsModule, CommonModule, ButtonComponent],
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.css'],
})
export class ClientCredentialsComponent implements OnInit {
  @HostBinding('class') className = 'w-full';

  prefixes = [
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+61', country: 'Australia' },
    { code: '+81', country: 'Japan' },
    { code: '+49', country: 'Germany' },
    { code: '+86', country: 'China' },
    { code: '+33', country: 'France' },
    { code: '+39', country: 'Italy' },
    { code: '+7', country: 'Russia' },
    { code: '+55', country: 'Brazil' },
    { code: '+27', country: 'South Africa' },
  ];

  userName: string = '';
  email: string = '';
  selectedPrefix = this.prefixes[0].code;
  phoneNumber: string = '';
  phone: string = '';

  constructor(
    public model: PlatformModelService,
    private participantService: ParticipantService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.signInAnonymously();

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
    // Combine the prefix and phone number
    this.phone = this.selectedPrefix + this.phoneNumber;
    this.participantService.joinRoom(this.userName, this.email, this.phone);
  }
}
