import { Component, DoCheck, HostBinding, OnInit } from '@angular/core';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { Option, Question } from '../../../models/question.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipantService } from '../../../services/participant.service';
import { Router } from '@angular/router';
import '../../../../../questions.json';
import questions from '../../../../../questions.json';
import { RadioComponent } from '../../../components/quiz/radio/radio.component';
import feedbackList from '../../../../assets/static_data/feedbacks.json';

export enum ParticipantState {
  WaitingForQuestion,
  ViewingQuestion,
  WaitingForNextQuestion,
  QuestionnaireFinished,
}

@Component({
  selector: 'app-client-question',
  standalone: true,
  imports: [CommonModule, FormsModule, RadioComponent],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
})
export class ClientQuestionComponent implements DoCheck {
  @HostBinding('class') className = 'w-full';

  public feedback: string[] = [];

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

    //_______
    this.model.standardQuestions.set(questions as Question[]);
    this.model.session.currentQuestionIndex.set(1);
    this.model.session.client.participantState.set(
      ParticipantState.ViewingQuestion
    );
  }

  selectedOption: number | null = null;

  ParticipantStateTypes = ParticipantState;

  ngDoCheck(): void {
    if (this.model.session.currentPhase() === 'tree') {
      this.router.navigate([`client/${this.model.session.roomId()}/tree`]);
    }
  }

  clickedAnswer(option: Option) {
    this.selectedOption = option.id;
    this.submitAnswer();
  }

  submitAnswer() {
    if (this.selectedOption === null) {
      return;
    }
    this.participantService.submitAnswer(this.selectedOption);
    this.selectedOption = -1;
  }
}
