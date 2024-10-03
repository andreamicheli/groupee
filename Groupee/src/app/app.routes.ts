import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { ClientCodeComponent } from './pages/client/code/code.component';
import { ClientWaitingComponent } from './pages/client/waiting/waiting.component';
import { HostSettingsComponent } from './pages/host/settings/settings.component';
import { HostWaitingComponent } from './pages/host/waiting/waiting.component';

export const routes: Routes = [
  { path: 'landing', component: LandingComponent },
  { path: 'client/code', component: ClientCodeComponent },
  { path: 'client/waiting', component: ClientWaitingComponent },
  { path: 'host/settings', component: HostSettingsComponent },
  { path: 'host/waiting', component: HostWaitingComponent },
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: '**', redirectTo: '/landing' }, // Wildcard route for a 404 page
];
