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
  selector: 'app-client-radio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css'],
})
export class RadioComponent {
  @HostBinding('class') className = 'w-full flex justify-center';

  @Input() options: Array<{ text: string; id: any }> = [];
  @Input() selectedOptionIndex: number | null = null;
  @Output() optionSelected = new EventEmitter<any>();

  private holdStartTimes: number[] = [];
  private holdTime = 700; // .7 seconds
  public holdProgress: number[] = []; // Track each option's progress independently
  private animationFrameId: number | null = null;
  public indexPressedEnd: number | null = null;

  constructor() {
    // Initialize holdProgress for each option
    this.options.forEach(() => this.holdProgress.push(0));
  }

  private isHapticSupported(): boolean {
    return 'vibrate' in navigator;
  }

  triggerHapticFeedback() {
    if (this.isHapticSupported()) {
      navigator.vibrate(50); // Vibrate for 50 milliseconds
    }
  }

  startHold(option: any, index: number): void {
    this.triggerHapticFeedback();
    this.holdProgress[index] = 0; // Reset progress for this option
    this.holdStartTimes[index] = Date.now();

    const updateProgress = () => {
      const elapsedTime = Date.now() - this.holdStartTimes[index];
      this.holdProgress[index] = Math.min(
        (elapsedTime / this.holdTime) * 100,
        100
      );

      if (this.holdProgress[index] < 100) {
        this.animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        this.indexPressedEnd = index;
        this.optionSelected.emit(option);
        this.cancelHold(index);
      }
    };

    this.animationFrameId = requestAnimationFrame(updateProgress);
  }

  cancelHold(index: number): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.holdProgress[index] = 0;
  }

  preventContextMenu(event: MouseEvent): void {
    event.preventDefault();
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
}
