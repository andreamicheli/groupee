import { Component, HostBinding } from '@angular/core';
import { QRCodeComponent, QRCodeModule } from 'angularx-qrcode';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { HostService } from '../../../services/host.service';

@Component({
  selector: 'app-host-waiting',
  standalone: true,
  imports: [QRCodeModule],
  templateUrl: './waiting.component.html',
  styleUrl: './waiting.component.css',
})
export class HostWaitingComponent {
  @HostBinding('class') className = 'w-full';

  constructor(
    public model: PlatformModelService,
    private hostService: HostService
  ) {}

  startQuestionnaire(): void {
    this.hostService.startQuestionnaire();
  }
}
