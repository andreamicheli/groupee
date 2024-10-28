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

  private holdTimer: any;
  private progressInterval: any;
  private holdTime = 700; // .7 seconds

  public holdProgress = 0; // Track progress as percentage

  private isHapticSupported(): boolean {
    return 'vibrate' in navigator;
  }

  getOptionClass(index: number): string {
    const colorClasses = [
      'bg-t-orange hover:bg-t-orange-hover active:bg-t-orange-active',
      'bg-t-green hover:bg-t-green-hover active:bg-t-green-active',
      'bg-t-burgundy hover:bg-t-burgundy-hover active:bg-t-burgundy-active',
      'bg-t-purple hover:bg-t-purple-hover active:bg-t-purple-active',
    ];
    return colorClasses[index] || '';
  }

  getLoadingBarClass(index: number): string {
    const colorClasses = [
      'bg-t-orange',
      'bg-t-green',
      'bg-t-burgundy',
      'bg-t-purple',
    ];
    return colorClasses[index] || '';
  }

  triggerHapticFeedback() {
    if (this.isHapticSupported()) {
      navigator.vibrate(50); // Vibrate for 50 milliseconds
    }
  }

  startHold(option: any): void {
    this.triggerHapticFeedback();

    this.holdProgress = 0;

    // Start a timer to track progress
    this.progressInterval = setInterval(() => {
      this.holdProgress += 100 / (this.holdTime / 10); // Increment progress
      if (this.holdProgress >= 100) {
        clearInterval(this.progressInterval);
      }
    }, 10);

    // Start hold timer
    this.holdTimer = setTimeout(() => {
      this.optionSelected.emit(option);
      this.resetProgress();
    }, this.holdTime);
  }

  cancelHold(): void {
    clearTimeout(this.holdTimer);
    clearInterval(this.progressInterval);
    this.resetProgress();
  }

  private resetProgress(): void {
    this.holdProgress = 0;
  }
}
