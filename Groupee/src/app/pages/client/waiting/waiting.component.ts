import { Component, HostBinding } from '@angular/core';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-waiting',
  standalone: true,
  imports: [],
  templateUrl: './waiting.component.html',
  styleUrl: './waiting.component.css',
})
export class ClientWaitingComponent {
  @HostBinding('class') className = 'w-full';

  constructor(public model: PlatformModelService, private router: Router) {}

  ngOnInit() {
    if (!this.model.session.online()) {
      this.router.navigate(['client/code'], { replaceUrl: true });
    }
  }
}
