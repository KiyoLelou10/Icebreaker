import {Component, OnInit} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {KeycloakService} from '../../../Services/Keycloak/keycloak.service';
import {MatBadge} from '@angular/material/badge';
import {NavbarServiceService} from '../../../Services/Navbar/navbar-service.service';
import {ProfileNavbarDTO} from '../../../DTOS/ProfileNavbar/ProfileNavbarDTO';
import {ChatService} from '../../../Services/ChatService/chat.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLinkActive,
    RouterLink,
    MatIconModule,
    MatMenuModule,
    MatBadge,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  profileCompleted: boolean = false;
  username:string= '';

  constructor(private keycloakService: KeycloakService, private  router: Router, private profileNavbarService: NavbarServiceService, private chatService:ChatService) {
  }

  ngOnInit(): void {
    // Fetch profile data from the backend
    this.profileNavbarService.fetchProfile().subscribe({
      next: (profile) => {
        console.log('Fetched profiile successfully');
      },
      error: (err) => {
        console.error('Failed to fetch profile', err);
      },
    });

    this.profileNavbarService.profile$.subscribe({
      next: (profile) => {
        if (profile) {
          this.username = profile.username;
          this.profileCompleted = profile.isProfileComplete;
        }
      },
    });
  }

  completeProfile(): void {
    this.router.navigate(['/changeProfile']);
  }

  logout(): void {
    this.keycloakService.logout();
  }

  onChatOverview() {
    this.profileNavbarService.fetchProfile().subscribe({
      next: (profile) => {
        console.log('Fetched profile successfully');
      },
      error: (err) => {
        console.error('Failed to fetch profile', err);
      },
    });

    this.chatService.getLoggedInUser();
    this.router.navigate(['/chatOverview']);
  }
}
