import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlatformModelService } from '../../dataStructures/PlatformModel.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  constructor(private model: PlatformModelService) {}

  ngOnInit(): void {
    this.model.session.currentPhase.set(null);
  }
}
