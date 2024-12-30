import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import {ProfileNavbarDTO} from '../../DTOS/ProfileNavbar/ProfileNavbarDTO';

@Injectable({
  providedIn: 'root'
})
export class NavbarServiceService {

  private profileSubject = new BehaviorSubject<ProfileNavbarDTO | null>(null);
  profile$ = this.profileSubject.asObservable();


  constructor(private http: HttpClient) { }

  fetchProfile(): Observable<ProfileNavbarDTO> {
    return this.http.get<ProfileNavbarDTO>('http://localhost:8080/api/profileHome/me').pipe(
      tap((profile) => {
        this.profileSubject.next(profile);
      })
    );
  }

  getMyPrivKey(userId: string): Observable<string> {
    return this.http.get(`http://localhost:8080/api/profile/fetchMyPrivKey/${userId}`, { responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('Error fetching private key:', error);
        return throwError(() => new Error('Failed to fetch private key'));
      })
    );
  }


  uploadKeyPair(userId: string, publicKey: string, privateKey: string): Observable<void> {
    const payload = { publicKey, privateKey };
    return this.http.post<void>(`http://localhost:8080/api/profile/uploadKeyPair/${userId}`, payload).pipe(
      catchError((error) => {
        console.error('Error uploading key pair:', error);
        return throwError(() => new Error('Failed to upload key pair'));
      })
    );
  }
}
