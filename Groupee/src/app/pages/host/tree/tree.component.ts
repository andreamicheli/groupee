import { Component, OnInit } from '@angular/core';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HostService } from '../../../services/host.service';

@Component({
  selector: 'app-host-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css',
})
export class HostTreeComponent implements OnInit {
  constructor(
    public model: PlatformModelService,
    private router: Router,
    private hostService: HostService
  ){}

  ngOnInit(): void {
    if (
      this.model.session.currentPhase() !== 'tree' ||
      !this.model.session.online()
    ) {
      this.router.navigate(['/']);
    }
  }

  createGroups(): void {
    console.log(this.model.session.participants().length);
    console.log(this.model.groupSettings.clientsInGroup());

    //call the createGroups function
    this.hostService.createGroups();
  }

  // ngOnDestroy() {
  //   this.hostService.unsubscribeAll();
  // }
}
