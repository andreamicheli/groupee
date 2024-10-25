import { Component, HostBinding, OnDestroy } from '@angular/core';
import { HostService } from '../../../services/host.service';
import { FormsModule } from '@angular/forms';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';

@Component({
  selector: 'app-host-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class HostSettingsComponent implements OnDestroy {
  @HostBinding('class') className = 'w-full';

  peopleNumber: number = 0;

  constructor(
    private hostService: HostService,
    public model: PlatformModelService
  ) {}

  createRoom(): void {
    this.model.groupSettings.clientsInGroup.set(this.peopleNumber);
    this.hostService.subscribeAuth();
  }

  ngOnDestroy(): void {
    this.hostService.unsubscribeAll();
  }
}
