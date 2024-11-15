import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RandomImageService {
  private imageFolder = 'assets/images/hands';
  private imageListUrl = 'assets/static_data/image-list.json';

  constructor(private http: HttpClient) {}

  /**
   * Fetches the list of images and returns a random image path.
   * @returns {Observable<string>} - Observable that emits the random image path.
   */
  getRandomImage(): Observable<string> {
    return this.http.get<string[]>(this.imageListUrl).pipe(
      map((images) => {
        const randomIndex = Math.floor(Math.random() * images.length);
        return `${this.imageFolder}/${images[randomIndex]}`;
      })
    );
  }
}
