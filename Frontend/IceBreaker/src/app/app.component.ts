import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {KeycloakService} from './Services/Keycloak/keycloak.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NavbarComponent} from './Components/UtilComponents/navbar/navbar.component';
import {MatBadgeModule} from '@angular/material/badge';
import {UserStatusComponent} from './Components/UtilComponents/user-status/user-status.component';
import {CryptographyService} from './Services/CryptographyServices/cryptography.service';
import {MatDialog} from '@angular/material/dialog';
import {
  PassphraseDialogComponent
} from './Components/CryptographyComponents/passphrase-dialog/passphrase-dialog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, MatBadgeModule],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})


export class AppComponent implements OnInit{
  title = 'Icebreaker';
  helloText: string | undefined;

  constructor(private cryptoService: CryptographyService, private dialog: MatDialog,private router: Router, private http: HttpClient, private ks: KeycloakService) {}

  ngOnInit(): void {
    this.cryptoService.checkPassphraseStatus().subscribe((status) => {
      if (!status.hasPassphrase) {
        this.openDialog(true);
      } else {
        this.openDialog(false);
      }
    });
  }

  openDialog(isNew: boolean): void {
    const dialogRef = this.dialog.open(PassphraseDialogComponent, {
      disableClose: true,
      data: { isNew },
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (isNew) {
          this.cryptoService.updatePassphrase(result).subscribe();
        } else {
          this.cryptoService.verifyPassphrase(result.passphrase).subscribe();
        }
      }
    });
  }

  OnClick() {
    this.ks.logout();
  }


}
