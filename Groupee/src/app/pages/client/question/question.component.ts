import { Component, DoCheck, HostBinding } from '@angular/core';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { Option, Question } from '../../../models/question.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipantService } from '../../../services/participant.service';
import { Router } from '@angular/router';
import questions from '../../../../../questions.json';
import { RadioComponent } from '../../../components/quiz/client/radio/radio.component';
import feedbackList from '../../../../assets/static_data/feedbacks.json';
import { ButtonComponent } from '../../../components/button/button.component';

export enum ParticipantState {
  WaitingForQuestion,
  ViewingQuestion,
  WaitingForNextQuestion,
  QuestionnaireFinished,
}

@Component({
  selector: 'app-client-question',
  standalone: true,
  imports: [CommonModule, FormsModule, RadioComponent, ButtonComponent],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class ClientQuestionComponent implements DoCheck {
  @HostBinding('class') className = 'w-full';

  public feedback: string[] = [];

  // Updated selectedValue to be a number
  selectedValue: number = 3; // Default to neutral

  selectedOption: number | null = null;

  ParticipantStateTypes = ParticipantState;

  constructor(
    public model: PlatformModelService,
    public router: Router,
    private participantService: ParticipantService
  ) {
    this.feedback = Array.from(
      { length: this.model.standardQuestions().length },
      () =>
        feedbackList.feedback[
          Math.floor(Math.random() * feedbackList.feedback.length)
        ]
    );
  }

  ngDoCheck(): void {
    if (this.model.session.currentPhase() === 'tree') {
      this.router.navigate([`client/${this.model.session.roomId()}/tree`]);
    }
  }

  // Updated clickedAnswer method
  clickedAnswer(option: Option) {
    // For single-choice and video questions
    this.selectedOption = option.id;
    this.submitAnswer();
  }

  submitAnswer() {
    const currentQuestion =
      this.model.standardQuestions()[this.model.session.currentQuestionIndex()];
    if (currentQuestion.type === 'agree') {
      if (this.selectedValue == null) {
        return;
      }
      // Submit the selectedValue as the answer
      this.participantService.submitAnswer(this.selectedValue);
      this.model.session.client.participantState.set(
        ParticipantState.WaitingForNextQuestion
      );
      // Reset selectedValue if needed
      this.selectedValue = 3; // Reset to default if desired
    } else {
      if (this.selectedOption === null) {
        return;
      }
      // Submit the selectedOption as the answer
      this.participantService.submitAnswer(this.selectedOption);
      this.model.session.client.participantState.set(
        ParticipantState.WaitingForNextQuestion
      );
      this.selectedOption = null;
    }
  }
}
