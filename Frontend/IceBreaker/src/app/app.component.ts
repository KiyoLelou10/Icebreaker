import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {KeycloakService} from './Services/Keycloak/keycloak.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NavbarComponent} from './Components/UtilComponents/navbar/navbar.component';
import {MatBadgeModule} from '@angular/material/badge';
import {UserStatusComponent} from './Components/UtilComponents/user-status/user-status.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, MatBadgeModule, UserStatusComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent implements OnInit{
  title = 'Icebreaker';
  helloText: string | undefined;

  constructor(private router: Router, private http: HttpClient, private ks: KeycloakService) {}

  ngOnInit() {
  }

  OnClick() {
    this.ks.logout();
  }


}
