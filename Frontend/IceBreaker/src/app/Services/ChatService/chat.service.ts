import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ChatRoomOverviewDTO} from '../../DTOS/ChatDTOs/ChatRoomOverviewDTO';
import {Observable} from 'rxjs';
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
