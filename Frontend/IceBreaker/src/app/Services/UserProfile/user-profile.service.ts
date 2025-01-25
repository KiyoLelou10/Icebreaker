import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import {ProfileNavbarDTO} from '../../DTOS/ProfileNavbar/ProfileNavbarDTO';
import {PublicUserProfileDTO} from '../../DTOS/Profile/PublicUserProfileDTO';
import {HttpClient, HttpHeaders, HttpStatusCode} from '@angular/common/http';
import {AvailableUserDTO} from '../../DTOS/Profile/AvailableUserDTO';
import {ProfileWithStatusDTO} from '../../DTOS/Profile/ProfileWithStatusDTO';

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

  getMyStatusInformation(): Observable<ProfileWithStatusDTO> {
    return this.http.get<ProfileWithStatusDTO>("http://localhost:8080/api/profile/getMyStatusInformation");
  }

  getIceBreakers(bio: string): Observable<{ "Icebreaker 1": string; "Icebreaker 2": string; "Icebreaker 3": string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const payload = { input: bio };
    return this.http.post<{ "Icebreaker 1": string; "Icebreaker 2": string; "Icebreaker 3": string }>(
      "http://localhost:8080/api/generate",
      payload,
      { headers }
    );
  }

  updateStatus(userId: string, status: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `http://localhost:8080/api/profile/${userId}/status`,
      { status },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  clearSelectedUser(): void {
    this.selectedUserSubject.next(null);
  }


  getPublicKey(recipientId: string): Observable<string> {
    const url = `http://localhost:8080/api/profile/publicKey/${recipientId}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      catchError((error) => {
        console.error(`Error fetching public key for recipientId ${recipientId}:`, error);
        return throwError(() => new Error('Failed to fetch public key'));
      })
    );
  }

  getChatId(senderId: string, recipientId: string): Observable<string> {
    const url = `http://localhost:8080/chatId/${senderId}/${recipientId}`;
    return this.http.get<string>(url);
  }

  uploadSymmetricKey(senderId: string, recipientId: string, symmetricKey: string): Observable<void> {
    const payload = { senderId, recipientId, symmetricKey };
    console.log(payload);
    return this.http.post<void>('http://localhost:8080/saveSymmetricKey', payload).pipe(
      catchError((error) => {
        console.error('Error uploading key pair:', error);
        return throwError(() => new Error('Failed to upload key pair'));
      })
    );
  }


  searchUsers(username: string): Observable<AvailableUserDTO[]> {
    //const encodedQuery = encodeURIComponent(searchQuery.trim());
    return this.http.get<AvailableUserDTO[]>(`http://localhost:8080/api/profile/search/${username}`).pipe(
    tap((users) => console.log('Fetched users:', users)),
      catchError((error) => {
        console.error('Error searching for users:', error);
        return throwError(error);
      })
  );
  }
}
