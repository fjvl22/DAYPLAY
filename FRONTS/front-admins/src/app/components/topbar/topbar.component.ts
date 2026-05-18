import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule, ActionSheetController, ModalController } from "@ionic/angular";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth.service";
import { DeleteAccountComponent } from "src/app/modals/delete-account/delete-account.component";
import { ChangePasswordComponent } from "src/app/modals/change-password/change-password.component";

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {

  constructor(
    private auth: AuthService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController
  ) {}

  get nickname(): string {
    return this.auth.getNickname();
  }

  async openMenu() {
    const sheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Cerrar Sesión',
          handler: () => this.logout()
        },
        {
          text: 'Eliminar cuenta',
          handler: () => this.openDeleteAccount()
        },
        {
          text: 'Cambiar contraseña',
          handler: () => this.openChangePassword()
        }
      ]
    });

    await sheet.present();
  }

  logout() {
    this.auth.logout().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }

  async openDeleteAccount() {
    const modal = await this.modalCtrl.create({
      component: DeleteAccountComponent
    });
    await modal.present();
  }

  async openChangePassword() {
    const modal = await this.modalCtrl.create({
      component: ChangePasswordComponent
    });
    await modal.present();
  }
}