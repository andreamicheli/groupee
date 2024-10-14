import { Component, HostBinding, OnDestroy } from '@angular/core';
import { HostService } from '../../../services/host.service';

@Component({
  selector: 'app-host-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class HostSettingsComponent implements OnDestroy {
  @HostBinding('class') className = 'w-full';

  constructor(private hostService: HostService) {}

  createRoom(): void {
    this.hostService.subscribeAuth();
  }

  ngOnDestroy(): void {
    this.hostService.unsubscribeAll();
  }
}
