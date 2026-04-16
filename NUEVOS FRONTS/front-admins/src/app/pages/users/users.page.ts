import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule, AlertController } from "@ionic/angular";
import { AdminService } from "src/app/core/services/admin.service";
import { AppUser } from "src/app/core/interfaces/app-user";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './users.page.html'
})
export class UsersPage {

  users: AppUser[] = [];

  constructor(private admin: AdminService, private alertCtrl: AlertController) {this.load();}

  load() {this.admin.getUsers().subscribe(res => this.users = res);}

  async delete(id: number) {

    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Seguro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => { this.admin.deleteUser(id).subscribe(() => this.load()); }
        }
      ]
    });

    await alert.present();
  }
}