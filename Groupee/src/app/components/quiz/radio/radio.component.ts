import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.css',
})
export class RadioComponent {
  @HostBinding('class') className = 'w-full flex justify-center';

  @Input() options: Array<{ text: string; id: any }> = [];
  @Input() selectedOptionIndex: number | null = null;
  @Output() optionSelected = new EventEmitter<any>();

  getOptionClass(index: number): string {
    const colorClasses = [
      'bg-t-orange hover:bg-t-orange-hover active:bg-t-orange-active',
      'bg-t-green hover:bg-t-green-hover active:bg-t-green-active',
      'bg-t-burgundy hover:bg-t-burgundy-hover active:bg-t-burgundy-active',
      'bg-t-purple hover:bg-t-purple-hover active:bg-t-purple-active',
    ];
    return colorClasses[index] || '';
  }

  onOptionClick(option: any): void {
    this.optionSelected.emit(option);
  }
}
