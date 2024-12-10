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

  constructor(private keycloakService: KeycloakService, private  router: Router, private profileNavbarService: NavbarServiceService) {
  }

  ngOnInit(): void {
    this.profileNavbarService.getProfileNavbar().subscribe({
      next: (profile: ProfileNavbarDTO) => {
        this.username = profile.username;
        this.profileCompleted = profile.isProfileComplete;
      },
      error: (err) => {
        console.error('Failed to fetch profile', err);
      },
    });
  }

  completeProfile(): void {
    this.router.navigate(['/changeProfile']);
  }

  logout(): void {
    this.keycloakService.logout();
  }
}
