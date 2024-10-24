import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessario per le direttive *ngFor e *ngIf
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importa AngularFirestore (assicurati che la versione corrisponda alla tua configurazione)
import { ActivatedRoute } from '@angular/router';
import { Participant, Group } from '../../../models/room.model';

@Component({
  selector: 'app-grouping',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grouping.component.html',
  styleUrls: ['./grouping.component.css']
})
export class HostGroupingComponent implements OnInit {
  roomId: string = "";
  groups: Group[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Ottieni roomId dai parametri della route
    this.roomId = this.route.snapshot.paramMap.get('roomId')!;
    this.fetchGroups();
  }

  fetchGroups() {
    this.firestore.collection('rooms').doc(this.roomId)
      .collection<Group>('groups')
      .snapshotChanges()
      .subscribe(groupSnapshots => {
        this.groups = groupSnapshots.map(snap => {
          const { id, ...data } = snap.payload.doc.data() as Group;
          return { id, ...data };
        });
        this.isLoading = false;
      }, error => {
        console.error('Errore nel recupero dei gruppi:', error);
        this.errorMessage = 'Si è verificato un errore durante il recupero dei gruppi.';
        this.isLoading = false;
      });
  }
}