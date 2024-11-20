import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-slider',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
})
export class SliderComponent {
  @HostBinding('class') className = 'w-full flex justify-center h-full';

  @Input() options: Array<{ text: string; id: any }> = [];
  @Output() optionSelected = new EventEmitter<any>();
  public selectedOptionIndex: number | null = 3;

  submitAnswer() {
    this.optionSelected.emit(this.selectedOptionIndex);
  }
}
