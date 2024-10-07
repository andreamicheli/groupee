import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-client-waiting',
  standalone: true,
  imports: [],
  templateUrl: './waiting.component.html',
  styleUrl: './waiting.component.css',
})
export class ClientWaitingComponent {
  @HostBinding('class') className = 'w-full';
}
