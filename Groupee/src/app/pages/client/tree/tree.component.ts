import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { Participant } from '../../../models/room.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-client-tree',
  standalone: true,
  imports: [],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css',
})
export class ClientTreeComponent implements OnInit {
  roomId: string = '';
  participant: Participant | undefined;
  constructor(public model: PlatformModelService, private router: Router,  private firestore: AngularFirestore,  private route: ActivatedRoute) {
    this.participant = this.model.session
      .participants()
      .find(
        (p) => p.participantId === this.model.session.client.participantId()
      );
  }

  ngOnInit(): void {
    const roomId = this.route.snapshot.paramMap.get('roomId');
    console.log(this.model.session.participants());

    if (
      this.model.session.currentPhase() !== 'tree' ||
      !this.model.session.online()
    ) {
      this.router.navigate(['/']);
    }
    this.listenForPhaseChanges();
  }

  listenForPhaseChanges() {
    this.firestore.collection('rooms').doc(this.roomId).valueChanges().subscribe((roomData: any) => {
      if (roomData && roomData.currentPhase === 'groups') {
        // Navigate to the grouping component
        this.router.navigate([`participant/${this.roomId}/grouping`]);
      }
    });
  }
}
