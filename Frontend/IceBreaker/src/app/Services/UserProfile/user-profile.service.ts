import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {ProfileNavbarDTO} from '../../DTOS/ProfileNavbar/ProfileNavbarDTO';
import {PublicUserProfileDTO} from '../../DTOS/Profile/PublicUserProfileDTO';
import {HttpClient} from '@angular/common/http';
import {AvailableUserDTO} from '../../DTOS/Profile/AvailableUserDTO';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private http: HttpClient) { }

  getMyProfile(): Observable<PublicUserProfileDTO> {
    return this.http.get<PublicUserProfileDTO>("http://localhost:8080/api/profile/fetchMyDetails");
  }

  saveProfile(profile: PublicUserProfileDTO): Observable<PublicUserProfileDTO> {
    return this.http.put<PublicUserProfileDTO>('http://localhost:8080/api/profile/updateDetails', profile);
  }

  getAvailableUsers(): Observable<AvailableUserDTO[]> {
    return this.http.get<AvailableUserDTO[]>("http://localhost:8080/api/profile/getAllExceptMe");
  }

}
