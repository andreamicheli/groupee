import { Component, DoCheck, HostBinding, OnInit } from '@angular/core';
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
export class ClientQuestionComponent implements DoCheck, OnInit {
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

  ngOnInit(): void {
    // if (
    //   this.model.session.currentPhase() !== 'tree' &&
    //   this.model.session.currentPhase() !== 'questions'
    // ) {
    //   this.router.navigate([`/`]);
    // }
    //DEBUG
    // this.model.standardQuestions.set([
    //   {
    //     questionId: 1,
    //     title:
    //       'When you’re in a group setting, how do you feel about starting conversations?',
    //     options: [
    //       {
    //         id: 1,
    //         text: 'a',
    //         values: {
    //           element1: 8,
    //           element2: 6,
    //           element3: 7,
    //           element4: 9,
    //           element5: 5,
    //         },
    //       },
    //       {
    //         id: 2,
    //         text: 'a',
    //         values: {
    //           element1: 5,
    //           element2: 8,
    //           element3: 6,
    //           element4: 4,
    //           element5: 7,
    //         },
    //       },
    //       {
    //         id: 3,
    //         text: 'a',
    //         values: {
    //           element1: 4,
    //           element2: 5,
    //           element3: 3,
    //           element4: 6,
    //           element5: 8,
    //         },
    //       },
    //       {
    //         id: 4,
    //         text: 'a',
    //         values: {
    //           element1: 3,
    //           element2: 4,
    //           element3: 2,
    //           element4: 7,
    //           element5: 6,
    //         },
    //       },
    //     ],
    //     type: 'single-choice',
    //     url: '',
    //     order: 1,
    //   },
    // ]);
    // this.model.session.currentQuestionIndex.set(0);
    // this.model.session.client.participantState.set(
    //   this.ParticipantStateTypes.ViewingQuestion
    // );
    //END DEBUG
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
