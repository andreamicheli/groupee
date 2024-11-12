import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { QRCodeComponent, QRCodeModule } from 'angularx-qrcode';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { HostService } from '../../../services/host.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../components/button/button.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-host-waiting',
  standalone: true,
  imports: [QRCodeModule, CommonModule, ButtonComponent, MatIconModule],
  templateUrl: './waiting.component.html',
  styleUrl: './waiting.component.css',
})
export class HostWaitingComponent implements OnInit, OnDestroy {
  @HostBinding('class') className = 'w-full';

  private URL: string = 'https://groupee-fi.web.app';
  showCopiedMessage = false;

  constructor(
    public model: PlatformModelService,
    private router: Router,
    private hostService: HostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const roomId = this.route.snapshot.paramMap.get('roomId');
    if (!this.model.session.online()) {
      if (roomId?.length == 20) {
        this.model.session.roomId.set(roomId);
        this.hostService.subscribeToRoom();
      }
      this.router.navigate(['/'], { replaceUrl: true });
    }

    //FOR STYILING OFFLINE
    // this.model.session.roomId.set(roomId!);
    // this.model.session.participantLink.set(
    //   this.URL + roomId + 'client/waiting'
    // );
  }

  getLink(): string {
    return this.URL + this.model.session.participantLink();
  }

  startQuestionnaire(): void {
    this.hostService.startQuestionnaire();
  }

  getRandomPosition(): { [key: string]: string } {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const centralWidth = 250;
    const centralHeight = 250;
    const topOffset = 120;

    let x, y;

    do {
      x = Math.random() * 80; // Random X position (in %)
      y = Math.random() * 80; // Random Y position (in %)
    } while (
      (x * screenWidth) / 100 > (screenWidth - centralWidth) / 2 &&
      (x * screenWidth) / 100 < (screenWidth + centralWidth) / 2 &&
      (y * screenHeight) / 100 >
        (screenHeight - centralHeight) / 2 + topOffset &&
      (y * screenHeight) / 100 < (screenHeight + centralHeight) / 2 + topOffset
    );

    return {
      position: 'absolute',
      top: `${y}%`,
      left: `${x}%`,
      transform: 'translate(-50%, -50%)', // Center the name on the position
    };
  }

  ngOnDestroy() {
    this.hostService.unsubscribeAll();
  }

  copyRoomIdToClipboard(): void {
    navigator.clipboard.writeText(this.model.session.roomId());
    this.showCopiedMessage = true;
    setTimeout(() => {
      this.showCopiedMessage = false;
    }, 1000);
  }
}
