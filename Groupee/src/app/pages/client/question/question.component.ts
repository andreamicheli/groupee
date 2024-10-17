import { Component, DoCheck, OnInit } from '@angular/core';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { Option } from '../../../models/question.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipantService } from '../../../services/participant.service';
import { Router } from '@angular/router';

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
  selectedOption: number | null = null;

  ParticipantStateTypes = ParticipantState;

  constructor(
    public model: PlatformModelService,
    public router: Router,
    private participantService: ParticipantService
  ) {}

  ngDoCheck(): void {
    if (this.model.session.currentPhase() === 'tree') {
      this.router.navigate([`client/${this.model.session.roomId()}/tree`]);
    }
  }

  submitAnswer() {
    if (this.selectedOption === null) {
      return;
    }
    this.participantService.submitAnswer(this.selectedOption);
    this.selectedOption = -1;
  }
}
