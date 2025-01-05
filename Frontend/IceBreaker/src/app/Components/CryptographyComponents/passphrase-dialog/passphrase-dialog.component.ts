import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {CryptographyService} from '../../../Services/CryptographyServices/cryptography.service';
import {KeycloakService} from '../../../Services/Keycloak/keycloak.service';


@Component({
  selector: 'app-passphrase-dialog',
  standalone: true,
  imports: [
    MatFormField,
    MatDialogContent,
    NgIf,
    FormsModule,
    MatInput,
    MatDialogActions,
    MatButton,
    MatLabel
  ],
  templateUrl: './passphrase-dialog.component.html',
  styleUrl: './passphrase-dialog.component.css'
})
export class PassphraseDialogComponent {
  passphrase: string = '';
  confirmPassphrase: string = '';
  magicNumber: number | null = null;
  confirmMagicNumber: number | null = null;
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<PassphraseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cryptographyService: CryptographyService,
    private keycloakService: KeycloakService
  ) {}

  onCancel(): void {
    this.keycloakService.logout();
  }

  onSave(): void {
    if (this.data.isNew) {
      if (!this.passphrase || !this.confirmPassphrase) {
        this.errorMessage = 'Passphrase cannot be empty!';
        return;
      }
      if (this.passphrase !== this.confirmPassphrase) {
        this.errorMessage = 'Passphrases do not match!';
        return;
      }
      if (this.magicNumber === null || this.confirmMagicNumber === null) {
        this.errorMessage = 'Magic number cannot be empty!';
        return;
      }
      if (this.magicNumber !== this.confirmMagicNumber) {
        this.errorMessage = 'Magic numbers do not match!';
        return;
      }

      this.cryptographyService
        .updatePassphrase({
          passphrase: this.passphrase,
          magicNumber: this.magicNumber,
        })
        .subscribe(
          () => {
            this.dialogRef.close({
              passphrase: this.passphrase,
              magicNumber: this.magicNumber,
            });
          },
          (error) => {
            this.errorMessage = 'Error saving passphrase. Please try again.';
          }
        );
    } else {
      // Validation for verifying passphrase
      if (!this.passphrase) {
        this.errorMessage = 'Passphrase cannot be empty!';
        return;
      }

      this.cryptographyService.verifyPassphrase(this.passphrase).subscribe(
        () => {
          this.dialogRef.close({ passphrase: this.passphrase });
        },
        () => {

          this.errorMessage = 'Incorrect passphrase. Please try again.';
        }
      );
    }
  }

}
