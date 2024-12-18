import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import {ProfileNavbarDTO} from '../../DTOS/ProfileNavbar/ProfileNavbarDTO';
import {PublicUserProfileDTO} from '../../DTOS/Profile/PublicUserProfileDTO';
import {HttpClient} from '@angular/common/http';
import {AvailableUserDTO} from '../../DTOS/Profile/AvailableUserDTO';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private selectedUserSubject = new BehaviorSubject<PublicUserProfileDTO | null>(
    null
  );
  selectedUser$  = this.selectedUserSubject.asObservable();


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

  getProfileById(id: string): Observable<PublicUserProfileDTO> {
    return this.http.get<PublicUserProfileDTO>(`http://localhost:8080/api/profile/${id}`).pipe(
      tap((user) => {
        this.selectedUserSubject.next(user); // Update the BehaviorSubject with the fetched data
      }),
      catchError((error) => {
        console.error('Error fetching user profile:', error);
        this.selectedUserSubject.next(null); // Clear the subject in case of an error
        return throwError(error); // Pass the error along
      })
    );

  }
  clearSelectedUser(): void {
    this.selectedUserSubject.next(null);
  }
}
