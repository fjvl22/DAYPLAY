import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChangePasswordComponent } from '../modals/change-password/change-password.component';
import { DeleteAccountComponent } from '../modals/delete-account/delete-account.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [],
})
export class HeaderComponent {

  menuOpen = false;

  constructor(private modalController: ModalController) {}

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }

  async openModalChangePassword(): Promise<void> {
    this.menuOpen = false;

    const modal = await this.modalController.create({ component: ChangePasswordComponent });

    await modal.present();
  }

  async openModalDeleteAccount(): Promise<void> {
    this.menuOpen = false;

    const modal = await this.modalController.create({ component: DeleteAccountComponent });

    await modal.present();
  }

  logout(): void {
    this.menuOpen = false;

    //PROGRAMAR EL LOGOUT
  }

}
