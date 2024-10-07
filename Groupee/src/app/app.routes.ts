import { Routes } from '@angular/router';
import { HostComponent } from './components/host/host.component';
import { ParticipantComponent } from './components/participant/participant.component';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
  //{ path: '', component: LandingComponent },
  { path: '', component: HostComponent },
  { path: 'participant/:roomId', component: ParticipantComponent },
  // Add any additional routes here
];
