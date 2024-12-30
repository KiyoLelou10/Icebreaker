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

  constructor(private keycloakService: KeycloakService, private  router: Router, private profileNavbarService: NavbarServiceService, private chatService:ChatService, private privateKeyService : PrivateKeyService) {
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
          this.fetchPrivateKey(id);
        }
      },
    });
  }



  fetchPrivateKey(id: string): void {
    this.profileNavbarService.getMyPrivKey(id).subscribe({
      next: async (key: string) => {
        if (key) {
          console.log('Private Key fetched successfully:', key);
          this.privateKeyService.setPrivateKey(key);
        } else {
          console.log('Private key is null, generating a new key pair...');
          const keyPair = await generateKeyPair();
          console.log('New key pair generated:', keyPair);
          this.profileNavbarService.uploadKeyPair(id, keyPair.publicKey, keyPair.privateKey).subscribe({
            next: () => {
              console.log('Key pair uploaded successfully.');
            },
            error: (err) => {
              console.error('Failed to upload key pair:', err);
            },
          });
          this.privateKeyService.setPrivateKey(key);
        }
      },
      error: (err) => {
        console.error('Failed to fetch private key:', err);
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
