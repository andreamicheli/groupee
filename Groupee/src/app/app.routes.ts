import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { ClientCodeComponent } from './pages/client/code/code.component';
import { ClientWaitingComponent } from './pages/client/waiting/waiting.component';
import { HostSettingsComponent } from './pages/host/settings/settings.component';
import { HostWaitingComponent } from './pages/host/waiting/waiting.component';
import { ClientCredentialsComponent } from './pages/client/credentials/credentials.component';
import { ClientQuestionComponent } from './pages/client/question/question.component';
import { ClientTreeComponent } from './pages/client/tree/tree.component';
import { HostQuestionComponent } from './pages/host/question/question.component';
import { HostTreeComponent } from './pages/host/tree/tree.component';
import { HostGroupingComponent } from './pages/host/grouping/grouping.component';
import { ClientGroupingComponent } from './pages/client/grouping/grouping.component';

export const routes: Routes = [
  { path: 'landing', component: LandingComponent },
  { path: 'client/code', component: ClientCodeComponent },
  { path: 'client/:roomId/credentials', component: ClientCredentialsComponent },
  { path: 'client/:roomId/waiting', component: ClientWaitingComponent },
  { path: 'client/:roomId/question', component: ClientQuestionComponent },
  { path: 'client/:roomId/groups', component: ClientGroupingComponent },
  { path: 'client/:roomId/tree', component: ClientTreeComponent },
  { path: 'host/settings', component: HostSettingsComponent },
  { path: 'host/:roomId/waiting', component: HostWaitingComponent },
  { path: 'host/:roomId/question', component: HostQuestionComponent },
  { path: 'host/:roomId/tree', component: HostTreeComponent },
  { path: 'host/:roomId/groups', component: HostGroupingComponent },
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: '**', redirectTo: '/landing' }, // Wildcard route for a 404 page
];
