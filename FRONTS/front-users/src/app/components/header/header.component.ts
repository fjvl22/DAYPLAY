import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import {
  ActionSheetController, IonicModule
} from '@ionic/angular';

import { DeleteAccountComponent } from 'src/app/modals/delete-account.modal/delete-account.modal.component';
import { ChangePasswordComponent } from 'src/app/modals/change-password.modal/change-password.modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IonicModule, CommonModule, DeleteAccountComponent, ChangePasswordComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  nickname = localStorage.getItem('nickname') || 'User';

  @ViewChild('deleteAccount') deleteAccount!: DeleteAccountComponent;
  @ViewChild('changePassword') changePassword!: ChangePasswordComponent;

  constructor(
    public auth: AuthService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController
  ) {}

  async openMenu(event: any) {

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Cuenta',
      buttons: [
        {
          text: 'Cambiar contraseña',
          handler: () => this.changePassword.openModal()
        },
        {
          text: 'Eliminar cuenta',
          role: 'destructive',
          handler: () => this.deleteAccount.openModal()
        },
        {
          text: 'Cerrar sesión',
          role: 'destructive',
          handler: () => this.logout()
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}