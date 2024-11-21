import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlatformModelService } from '../../../dataStructures/PlatformModel.service';
import { Participant } from '../../../models/room.model';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import comments from '../../../../assets/static_data/traitsComments.json';
import { ButtonComponent } from '../../../components/button/button.component';
import { HostService } from '../../../services/host.service';

interface Comments {
  [key: number]: {
    [key: number]: string;
  };
}

@Component({
  selector: 'app-host-tree',
  standalone: true,
  imports: [CommonModule, NgChartsModule, ButtonComponent],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css',
})
export class HostTreeComponent implements OnInit {
  @HostBinding('class') className = 'w-full';

  averageResults: {
    element1: number;
    element2: number;
    element3: number;
    element4: number;
    element5: number;
  } = {
    element1: 0,
    element2: 0,
    element3: 0,
    element4: 0,
    element5: 0,
  };

  radarChartDatasets: ChartConfiguration<'radar'>['data']['datasets'] = [
    { data: [] },
  ];

  selectedOption: { element: number; rank: number } | null = null;

  public comments: Comments = comments;

  constructor(
    public model: PlatformModelService,
    private router: Router,
    private hostService: HostService
  ) { }

  ngOnInit(): void {
    if (
      (this.model.session.currentPhase() !== 'tree' &&
        this.model.session.currentPhase() !== 'groups') ||
      !this.model.session.online()
    ) {
      this.router.navigate(['/']);
    }

    const participants = this.model.session.participants();
    const numParticipants = participants.length;

    if (numParticipants > 0) {
      // Sum up cumulativeResults
      let totalElement1 = 0;
      let totalElement2 = 0;
      let totalElement3 = 0;
      let totalElement4 = 0;
      let totalElement5 = 0;

      participants.forEach((participant) => {
        totalElement1 += participant.cumulativeResult.element1;
        totalElement2 += participant.cumulativeResult.element2;
        totalElement3 += participant.cumulativeResult.element3;
        totalElement4 += participant.cumulativeResult.element4;
        totalElement5 += participant.cumulativeResult.element5;
      });

      // Calculate averages
      this.averageResults.element1 = totalElement1 / numParticipants;
      this.averageResults.element2 = totalElement2 / numParticipants;
      this.averageResults.element3 = totalElement3 / numParticipants;
      this.averageResults.element4 = totalElement4 / numParticipants;
      this.averageResults.element5 = totalElement5 / numParticipants;

      // Initialize radarChartDatasets
      this.radarChartDatasets = [
        {
          data: [
            this.averageResults.element1,
            this.averageResults.element2,
            this.averageResults.element3,
            0,
            this.averageResults.element4,
            this.averageResults.element5,
          ],
          label: 'Average Scores',
        },
      ];
    }
  }

  getOpacity(element: number, rank: number) {
    if (rank == 0)
      if (element > 4) return 1;
      else return 0.3;
    if (rank == 1)
      if (element > 8) return 1;
      else return 0.3;
    if (rank == 2)
      if (element >= 12) return 1;
      else return 0.3;
    if (rank == 3)
      if (element > 16) return 1;
      else return 0.3;
    else return 0.3;
  }

  onElementClick(element: number, rank: number) {
    console.log('element clicked');
    this.selectedOption = { element, rank };
  }

  unselect() {
    this.selectedOption = null;
  }

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

  public lineChartLegend: boolean = false;

  getComment(element: number, rank: number) {
    return this.comments[element as keyof Comments][
      rank as keyof Comments[number]
    ];
  }

  navToGroups(): void {
    //navigate to the groups page
    this.router.navigate([`host/${this.model.session.roomId()}/groups`]);
  }


  createGroups(): void {
    console.log(this.model.session.participants().length);
    console.log(this.model.groupSettings.clientsInGroup());

    //call the createGroups function
    if(this.model.session.currentPhase() == 'groups'){
      this.navToGroups();
    }
    else{
      this.hostService.createGroups();
    }
    
  }
}
