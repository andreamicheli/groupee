import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlatformModelService } from '../../dataStructures/PlatformModel.service';
import { ButtonComponent } from '../../components/button/button.component';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatIconModule, ButtonComponent, NavbarComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  constructor(private model: PlatformModelService, private router: Router) {}

  ngOnInit(): void {
    this.model.session.currentPhase.set(null);
  }

  navigateToHostSettings() {
    this.router.navigate(['/host/settings']);
  }
  navigateToClientCode() {
    this.router.navigate(['/client/code']);
  }
}
