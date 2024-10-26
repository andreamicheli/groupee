import { Component, DoCheck, HostBinding, OnInit } from '@angular/core';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { Option, Question } from '../../../models/question.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipantService } from '../../../services/participant.service';
import { Router } from '@angular/router';
import '../../../../../questions.json';
import questions from '../../../../../questions.json';

export enum ParticipantState {
  WaitingForQuestion,
  ViewingQuestion,
  WaitingForNextQuestion,
  QuestionnaireFinished,
}

@Component({
  selector: 'app-client-question',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
})
export class ClientQuestionComponent implements DoCheck {
  @HostBinding('class') className = 'w-full';

  selectedOption: number | null = null;

  ParticipantStateTypes = ParticipantState;

  constructor(
    public model: PlatformModelService,
    public router: Router,
    private participantService: ParticipantService
  ) {
    // //_______
    // this.model.standardQuestions.set(questions as Question[]);
    // this.model.session.currentQuestionIndex.set(1);
    // this.model.session.client.participantState.set(
    //   ParticipantState.ViewingQuestion
    // );
  }

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
