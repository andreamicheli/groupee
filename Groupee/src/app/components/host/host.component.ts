// host.component.ts

import { Component, OnInit } from '@angular/core';
import { Question } from '../../models/question.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HostService } from '../../services/host.service';
import { PlatformModelService } from '../../dataStructures/PlatformModel.service';

@Component({
  selector: 'app-host',
  standalone: true,
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css'],
  imports: [CommonModule],
})
export class HostComponent implements OnInit {
  private authSubscription: Subscription | undefined;
  private roomSubscription: Subscription | undefined;
  private questionsSubscription: Subscription | undefined;

  constructor(
    private hostService: HostService,
    public model: PlatformModelService
  ) {}

  ngOnInit(): void {
    this.hostService.subscribeAuth(); //implemented in host/settings
  }

  startQuestionnaire(): void {
    this.hostService.startQuestionnaire(); //implemented in host/waiting
  }

  getCurrentQuestion(): Question {
    return this.hostService.getCurrentQuestion();
  }

  nextQuestion(): void {
    this.hostService.nextQuestion();
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.authSubscription?.unsubscribe();
    this.roomSubscription?.unsubscribe();
    this.questionsSubscription?.unsubscribe();
  }
}
