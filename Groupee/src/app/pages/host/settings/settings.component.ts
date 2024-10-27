import { Component, HostBinding, OnDestroy } from '@angular/core';
import { HostService } from '../../../services/host.service';
import { FormsModule } from '@angular/forms';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { ButtonComponent } from '../../../components/button/button.component';

@Component({
  selector: 'app-host-settings',
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class HostSettingsComponent implements OnDestroy {
  @HostBinding('class') className = 'w-full';

  peopleNumber: number = 1;

  constructor(
    private hostService: HostService,
    public model: PlatformModelService
  ) {}

  test() {
    console.log('ciao');
  }

  createRoom(): void {
    console.log('ciao');

    this.model.groupSettings.clientsInGroup.set(this.peopleNumber);
    this.hostService.subscribeAuth();
  }

  ngOnDestroy(): void {
    this.hostService.unsubscribeAll();
  }
}
