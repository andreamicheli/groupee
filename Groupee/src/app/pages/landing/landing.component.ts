import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {

  public fetchedData: any[] = [];

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.fetchData('questions').then(data => {
      this.fetchedData = data;
      console.log('Fetched data:', this.fetchedData);
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  }

  // Function to fetch data from Firestore
  async fetchData(collectionName: string): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, collectionName));
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error('Failed to fetch data from Firestore');
    }
  }
}
