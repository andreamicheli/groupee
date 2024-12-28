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
import { SliderComponent } from '../../../components/quiz/slider/slider.component';

export enum ParticipantState {
  WaitingForQuestion,
  ViewingQuestion,
  WaitingForNextQuestion,
  QuestionnaireFinished,
}

@Component({
  selector: 'app-client-question',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RadioComponent,
    ButtonComponent,
    SliderComponent,
  ],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class ClientQuestionComponent implements DoCheck, OnInit {
  @HostBinding('class') className = 'w-full';

  public feedback: string[] = [];

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
    if (
      this.model.session.currentPhase() !== 'tree' &&
      this.model.session.currentPhase() !== 'questions'
    ) {
      this.router.navigate([`/`]);
    }
    // DEBUG
    // this.model.standardQuestions.set([
    //   {
    //     questionId: 1,
    //     title: 'When you\u2019re at a party, how do you typically behave?',
    //     url: '',
    //     options: [
    //       {
    //         id: 1,
    //         text: 'I love being the center of attention and socializing with everyone.',
    //         values: {
    //           element1: 10,
    //           element2: 0,
    //           element3: 0,
    //           element4: 0,
    //           element5: 0,
    //         },
    //       },
    //       {
    //         id: 2,
    //         text: "I enjoy talking to people, but I don't seek the spotlight.",
    //         values: {
    //           element1: 7,
    //           element2: 0,
    //           element3: 0,
    //           element4: 0,
    //           element5: 0,
    //         },
    //       },
    //       {
    //         id: 3,
    //         text: 'I prefer to talk only with people I know well.',
    //         values: {
    //           element1: 3,
    //           element2: 0,
    //           element3: 0,
    //           element4: 0,
    //           element5: 0,
    //         },
    //       },
    //       {
    //         id: 4,
    //         text: 'I tend to stay in the background and observe.',
    //         values: {
    //           element1: 1,
    //           element2: 0,
    //           element3: 0,
    //           element4: 0,
    //           element5: 0,
    //         },
    //       },
    //     ],
    //     type: 'single-choice',
    //     order: 1,
    //   },
    // ]);
    // this.model.session.currentQuestionIndex.set(0);
    // this.model.session.client.participantState.set(
    //   this.ParticipantStateTypes.ViewingQuestion
    // );
    // END DEBUG
  }

  ngDoCheck(): void {
    if (this.model.session.currentPhase() === 'tree') {
      this.router.navigate([`client/${this.model.session.roomId()}/tree`]);
    }
  }

  // Updated clickedAnswer method
  clickedAnswer(option: Option | number) {
    // For single-choice and video questions
    this.selectedOption = typeof option === 'number' ? option : option.id;
    this.submitAnswer();
  }

  submitAnswer() {
    if (this.selectedOption === null) {
      return;
    }
    // Submit the selectedOption as the answer
    this.participantService.submitAnswer(this.selectedOption);
    this.selectedOption = null;
  }
}
