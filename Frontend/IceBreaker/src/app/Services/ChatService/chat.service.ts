import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ChatRoomOverviewDTO} from '../../DTOS/ChatDTOs/ChatRoomOverviewDTO';
import {catchError, Observable, throwError} from 'rxjs';
import {ChatMessageDTO} from '../../DTOS/ChatDTOs/ChatMessageDTO';
import {NavbarServiceService} from '../Navbar/navbar-service.service';
import {ProfileNavbarDTO} from '../../DTOS/ProfileNavbar/ProfileNavbarDTO';



@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private LoggedInUser:ProfileNavbarDTO| null = null;
  private apiBase = 'http://localhost:8080'; // Replace with your API base URL

  constructor(private http: HttpClient, private navbarService: NavbarServiceService) {}

  getChatRooms(): Observable<ChatRoomOverviewDTO[]> {

    this.getLoggedInUser();
    return this.http.get<ChatRoomOverviewDTO[]>(`${this.apiBase}/chat-rooms/${this.LoggedInUser?.id}`);
  }

  getPublicKey(recipientId: string): Observable<string> {
    const url = `${this.apiBase}/api/profile/publicKey/${recipientId}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      catchError((error) => {
        console.error(`Error fetching public key for recipientId ${recipientId}:`, error);
        return throwError(() => new Error('Failed to fetch public key'));
      })
    );
  }

  getSymmetricKey(chatId: string, userId : string): Observable<string> {
    console.log('Fetching chatId for chat: ', chatId, 'and user id', userId);
    return this.http.get(`http://localhost:8080/symmetricKey/${chatId}/${userId}`, {responseType: 'text'}).pipe(
      catchError((error) => {
        console.error('Error fetching symmetric key:', error);
        return throwError(() => new Error('Failed to fetch private key'));
      })
    );
  }

  uploadSymmetricKey(chatId: string, userId: string, symmetricKey: string): Observable<void> {
    const payload = { chatId, userId, symmetricKey };
    console.log(payload);
    return this.http.post<void>('http://localhost:8080/saveSymmetricKey', payload).pipe(
      catchError((error) => {
        console.error('Error uploading key pair:', error);
        return throwError(() => new Error('Failed to upload key pair'));
      })
    );
  }

  getMessages(chatId: string): Observable<ChatMessageDTO[]> {
    return this.http.get<ChatMessageDTO[]>(`${this.apiBase}/messages/${chatId}`);
  }

   getLoggedInUser(): void {
    this.navbarService.profile$.subscribe({
      next: (profile) => {
        this.LoggedInUser = profile;
        console.log('Received profile:', profile);
      },
      error: (err) => {
        console.error('Failed to receive profile data', err);
      },
    });
  }


  public getLoggenInUserId() :string{
    return this.LoggedInUser?.id|| '';
  }
}
