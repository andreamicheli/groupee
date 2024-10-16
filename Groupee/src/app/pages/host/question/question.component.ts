import { Component } from '@angular/core';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HostService } from '../../../services/host.service';
import { Question } from '../../../models/question.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-host-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
})
export class HostQuestionComponent {
  constructor(
    public model: PlatformModelService,
    private router: Router,
    private hostService: HostService,
    private route: ActivatedRoute
  ) {}

  nextQuestion(): void {
    this.hostService.nextQuestion();
  }

  //   ngOnDestroy() {
  //   this.hostService.unsubscribeAll();
  // }
}
