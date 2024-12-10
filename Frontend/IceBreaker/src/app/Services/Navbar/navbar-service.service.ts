import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProfileNavbarDTO} from '../../DTOS/ProfileNavbar/ProfileNavbarDTO';

@Injectable({
  providedIn: 'root'
})
export class NavbarServiceService {

  constructor(private http: HttpClient) { }

  getProfileNavbar(): Observable<ProfileNavbarDTO> {
    return this.http.get<ProfileNavbarDTO>("http://localhost:8080/api/profileHome/me");
  }
}
