import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { Participant } from '../../../models/room.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/button/button.component';

@Component({
  selector: 'app-client-tree',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css',
})
export class ClientTreeComponent implements OnInit {
  @HostBinding('class') className = 'w-full';

  roomId: string = '';
  participant: Participant | undefined;

  constructor(
    public model: PlatformModelService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.participant = this.model.session
      .participants()
      .find(
        (p) => p.participantId === this.model.session.client.participantId()
      );

    // FOR DEBUGGING
    // this.participant = {
    //   participantId: '0',
    //   name: 'jhon',
    //   cumulativeResult: {
    //     element1: 30,
    //     element2: 38,
    //     element3: 33,
    //     element4: 32,
    //     element5: 25,
    //   },
    // };
  }

  ngOnInit(): void {
    const roomId = this.route.snapshot.paramMap.get('roomId');

    if (
      this.model.session.currentPhase() !== 'tree' ||
      !this.model.session.online()
    ) {
      this.router.navigate(['/']);
    }
  }

  buttonClick() {
    this.router.navigate([`client/${this.model.session.roomId()}/groups`]);
  }
}
