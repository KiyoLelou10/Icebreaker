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

}
