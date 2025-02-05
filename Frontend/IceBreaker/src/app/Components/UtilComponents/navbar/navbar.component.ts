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
import {generateKeyPair} from '../../E2EECompenents/KeyGenerate';
import {PrivateKeyService} from '../../../Services/UserProfile/PrivateKey.service';
import {PasskeySec} from '../../E2EECompenents/PasskeySec';
import {PasskeyService} from '../../../Services/CryptographyServices/Passkey.service';
import {Status} from '../../../Enums/Status';
import {UserProfileService} from '../../../Services/UserProfile/user-profile.service';
import {UserStatusComponent} from '../user-status/user-status.component';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLinkActive,
    RouterLink,
    MatIconModule,
    MatMenuModule,
    MatBadge,
    UserStatusComponent,
  ],
  providers: [PasskeySec],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  profileCompleted: boolean = false;
  username:string= '';
  idToLogout : string= ''

  constructor(private passkeyService: PasskeyService, private passkeySec : PasskeySec, private keycloakService: KeycloakService, private  router: Router, private profileNavbarService: NavbarServiceService, private chatService:ChatService, private privateKeyService : PrivateKeyService,
              private userService: UserProfileService) {
  }

  ngOnInit(): void {
    // Fetch profile data from the backend
    let id : string;
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
          id = profile.id;
          this.idToLogout = id;
        }
      },
    });
  }

  completeProfile(): void {
    this.router.navigate(['/changeProfile']);
  }

  logout(): void {

    const newStatus = Status.OFFLINE;


    this.userService.updateStatus(this.idToLogout, newStatus).subscribe({
      next: () => {
        console.log(`Status updated successfully to ${newStatus}`);
      },
      error: (error) => {
        if (error.status === 400) {
          console.error('Invalid status provided.');
        } else if (error.status === 404) {
          console.error('User not found.');
        } else {
          console.error('Unexpected error occurred:', error);
        }
      },
    });



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

  onSearch() {
    this.router.navigate(['/searchUser']);
  }
}
