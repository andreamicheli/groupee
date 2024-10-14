import { Component } from '@angular/core';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { Option } from '../../../models/question.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-question',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
})
export class ClientQuestionComponent {
  selectedOption: Option | null = null;

  constructor(public model: PlatformModelService) {}

  submitAnswer() {}
}
