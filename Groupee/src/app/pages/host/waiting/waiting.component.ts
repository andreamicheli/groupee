import { Component, HostBinding, OnInit } from '@angular/core';
import { QRCodeComponent, QRCodeModule } from 'angularx-qrcode';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { HostService } from '../../../services/host.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host-waiting',
  standalone: true,
  imports: [QRCodeModule, CommonModule],
  templateUrl: './waiting.component.html',
  styleUrl: './waiting.component.css',
})
export class HostWaitingComponent implements OnInit {
  @HostBinding('class') className = 'w-full';

  constructor(
    public model: PlatformModelService,
    private router: Router,
    private hostService: HostService
  ) {}

  ngOnInit() {
    if (!this.model.session.online()) {
      this.router.navigate(['/'], { replaceUrl: true });
    }
  }

  startQuestionnaire(): void {
    this.hostService.startQuestionnaire();
  }

  getRandomPosition(): { [key: string]: string } {
    const x = Math.random() * 80; // Random X position (in %)
    const y = Math.random() * 80; // Random Y position (in %)
    return {
      position: 'absolute',
      top: `${y}%`,
      left: `${x}%`,
      transform: 'translate(-50%, -50%)', // Center the name on the position
    };
  }
}
