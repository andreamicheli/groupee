import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'groupee-button',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() color: 'orange' | 'green' = 'orange';
  @Input() action: () => void = () => {};
  @Input() disabled?: boolean;
  @Input() icon?: string;
  @Input() text: string = 'Button';
  @Input() type: 'small' | 'wide' = 'small';

  hover: boolean = false;

  changeHover(flag: boolean) {
    this.hover = flag;
  }
}
