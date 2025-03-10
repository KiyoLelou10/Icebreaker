import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) {}

  // Helper function to wrap the geolocation API in a promise.
  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
        console.log(navigator.geolocation);
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

  // This method gets the current position and sends it to the backend.
  private updateLocation(): Observable<any> {
    return new Observable(observer => {
      this.getCurrentPosition()
        .then(position => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          // Replace '/api/location' with your actual backend endpoint.
          this.http.post('http://localhost:8080/location', coords).subscribe(
            response => {
              console.log('Location updated:', response);
              observer.next(response);
              observer.complete();
            },
            error => {
              console.error('Error sending location to backend:', error);
              observer.error(error);
            }
          );
        })
        .catch(error => {
          console.error('Geolocation error:', error);
          observer.error(error);
        });
    });
  }

  // Call this method to start periodic location updates every 5 minutes (300000ms).
  startPeriodicUpdates(): void {
    timer(0, 300000)
      .pipe(switchMap(() => this.updateLocation()))
      .subscribe({
        next: (result) => console.log('Location update successful:', result),
        error: (err) => console.error('Error during periodic location update:', err)
      });
  }
}
