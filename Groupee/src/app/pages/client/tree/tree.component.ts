import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { Participant } from '../../../models/room.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/button/button.component';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, Ticks } from 'chart.js';
import comments from '../../../../assets/static_data/traitsComments.json';

interface Comments {
  [key: number]: {
    [key: number]: string;
  };
}

@Component({
  selector: 'app-client-tree',
  standalone: true,
  imports: [CommonModule, ButtonComponent, NgChartsModule],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css',
})
export class ClientTreeComponent implements OnInit {
  @HostBinding('class') className = 'w-full';

  roomId: string = '';
  participant: Participant | undefined;
  radarChartData: any;

  selectedOption: { element: number; rank: number } | null = null;

  public comments: Comments = comments;

  constructor(
    public model: PlatformModelService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // this.participant = this.model.session
    //   .participants()
    //   .find(
    //     (p) => p.participantId === this.model.session.client.participantId()
    //   );

    // FOR DEBUGGING
    this.participant = {
      participantId: '0',
      name: 'jhon',
      email: 'andrea@live.com',
      phone: '123456789',
      cumulativeResult: {
        element1: 30,
        element2: 38,
        element3: 33,
        element4: 32,
        element5: 25,
      },
    };
  }

  ngOnInit(): void {
    const roomId = this.route.snapshot.paramMap.get('roomId');

    if (this.participant) {
      this.radarChartDatasets = [
        {
          data: [
            this.participant.cumulativeResult.element1,
            this.participant.cumulativeResult.element2,
            this.participant.cumulativeResult.element3,
            0,
            this.participant.cumulativeResult.element4,
            this.participant.cumulativeResult.element5,
          ],
        },
      ];
    }

    // if (
    //   this.model.session.currentPhase() !== 'tree' ||
    //   !this.model.session.online()
    // ) {
    //   this.router.navigate(['/']);
    // }
  }

  buttonClick() {
    this.router.navigate([`client/${this.model.session.roomId()}/groups`]);
  }

  getOpacity(element: number, rank: number) {
    if (rank == 0)
      if (element > 28) return 1;
      else return 0.3;
    if (rank == 1)
      if (element > 31) return 1;
      else return 0.3;
    if (rank == 2)
      if (element >= 34) return 1;
      else return 0.3;
    if (rank == 3)
      if (element > 34) return 1;
      else return 0.3;
    else return 0.3;
  }

  public lineChartLegend: boolean = false;

  public radarChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: false,
    borderColor: '#FF6333FF',
    backgroundColor: '#FF633331',
    scales: {
      r: {
        ticks: { display: false },
      },
    },
  };
  public radarChartLabels: string[] = ['', '', '', '', '', ''];

  public radarChartDatasets: ChartConfiguration<'radar'>['data']['datasets'] = [
    { data: [] },
  ];

  getComment(element: number, rank: number) {
    return this.comments[element as keyof Comments][
      rank as keyof Comments[number]
    ];
  }

  onElementClick(element: number, rank: number) {
    console.log('element clicked');
    this.selectedOption = { element, rank };
  }

  unselect() {
    console.log('unselect');

    this.selectedOption = null;
  }
}
