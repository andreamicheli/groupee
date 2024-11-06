import { Component, HostBinding, OnInit } from '@angular/core';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HostService } from '../../../services/host.service';
import { Question } from '../../../models/question.model';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/button/button.component';
import { RadioComponent } from '../../../components/quiz/host/radio/radio.component';

@Component({
  selector: 'app-host-question',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RadioComponent],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
})
export class HostQuestionComponent implements OnInit {
  @HostBinding('class') className = 'w-full';

  constructor(
    public model: PlatformModelService,
    private router: Router,
    private hostService: HostService
  ) {}

  nextQuestion(): void {
    console.log('Next question');

    this.hostService.nextQuestion();
  }

  ngOnInit(): void {
    if (
      this.model.session.currentPhase() !== 'questions' ||
      !this.model.session.online()
    ) {
      this.router.navigate(['/']);
    }
    this.hostService.checkAnswers();
  }

  /**
   * Sums up the total count of answers for a given question index.
   * @param questionIndex The index of the question to check.
   * @param currentAnswers The live map of the answers.
   * @returns The total count of answers given for the specified question index.
   */
  countTotalAnswers(
    questionIndex: number,
    currentAnswers: {
      [participantId: string]: {
        [questionIndex: number]: string;
      };
    }
  ): number {
    let count = 0;

    // Iterate over each participant's answers
    for (const participantAnswers of Object.values(currentAnswers)) {
      // Check if the participant answered the specific question
      if (participantAnswers.hasOwnProperty(questionIndex)) {
        count++; // Increment count for each answer
      }
    }

    return count; // Return the total count of answers for the question
  }

  ngOnDestroy() {
    this.hostService.unsubscribeAll();
  }
}
