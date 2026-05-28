import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { ModalController } from "@ionic/angular";

import { AuthService } from "src/app/core/services/auth.service";
import { ChangePasswordComponent } from "src/app/modals/change-password.modal/change-password.modal.component";
import { DeleteAccountComponent } from "src/app/modals/delete-account.modal/delete-account.modal.component";

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {

  nickname$ = this.auth.nickname$;

  dropdownOpen = false;

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private auth: AuthService
  ) {}

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        console.error('Error al cerrar sesión.');
      }
    });
  }

  async openChangePassword() {
    const modal = await this.modalCtrl.create({
      component: ChangePasswordComponent
    });
    await modal.present();
  }

  async openDeleteAccount() {
    const modal = await this.modalCtrl.create({
      component: DeleteAccountComponent
    });
    await modal.present();
  }
}