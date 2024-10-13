import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-json-uploader',
  templateUrl: './json-uploader.component.html',
  styleUrls: ['./json-uploader.component.css'],
  standalone: true,
})
export class JsonUploaderComponent {

  constructor(private firestoreService: FirestoreService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    
    // Check if a file is selected and it's a JSON file
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      
      // Parse the JSON data once the file is loaded
      reader.onload = (e) => {
        const jsonData = JSON.parse(reader.result as string);
        this.firestoreService.uploadJSONData(jsonData, 'questions');
      };

      reader.readAsText(file);
    } else {
      console.error('Please upload a valid JSON file.');
    }
  }
}
