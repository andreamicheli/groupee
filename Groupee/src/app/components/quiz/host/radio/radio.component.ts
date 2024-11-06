import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-host-radio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.css',
})
export class RadioComponent {
  @HostBinding('class') className = 'w-full flex justify-center';

  @Input() options: Array<{ text: string; id: any }> = [];
}
