import { Component, OnInit } from '@angular/core';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css',
})
export class HostTreeComponent implements OnInit {
  constructor(public model: PlatformModelService, private router: Router) {}

  ngOnInit(): void {
    if (
      this.model.session.currentPhase() !== 'tree' ||
      !this.model.session.online()
    ) {
      this.router.navigate(['/']);
    }
  }

  // ngOnDestroy() {
  //   this.hostService.unsubscribeAll();
  // }
}
