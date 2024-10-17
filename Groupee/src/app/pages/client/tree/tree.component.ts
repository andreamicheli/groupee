import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { Participant } from '../../../models/room.model';

@Component({
  selector: 'app-client-tree',
  standalone: true,
  imports: [],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css',
})
export class ClientTreeComponent implements OnInit {
  participant: Participant | undefined;
  constructor(public model: PlatformModelService, private router: Router) {
    this.participant = this.model.session
      .participants()
      .find(
        (p) => p.participantId === this.model.session.client.participantId()
      );
  }

  ngOnInit(): void {
    console.log(this.model.session.participants());

    if (
      this.model.session.currentPhase() !== 'tree' ||
      !this.model.session.online()
    ) {
      this.router.navigate(['/']);
    }
  }
}
