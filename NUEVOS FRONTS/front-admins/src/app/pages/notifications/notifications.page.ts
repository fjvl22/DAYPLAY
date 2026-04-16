import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule, AlertController } from "@ionic/angular";

import { AdminService } from "src/app/core/services/admin.service";
import { AuthService } from "src/app/core/services/auth.service";
import { AppUser } from "src/app/core/interfaces/app-user";
import { Admin } from "src/app/core/interfaces/admin";
import { Notification } from "src/app/core/interfaces/notification";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss']
})
export class NotificationsPage implements OnInit {

  mode: 'one' | 'all' = 'one';

  users: AppUser[] = [];
  selectedUserId: number | null = null;

  data = {
    type: '',
    title: '',
    message: ''
  };

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getUsers().subscribe({
      next: (res) => this.users = res,
      error: () => this.showAlert('Error cargando usuarios')
    });
  }

  send(): void {
    if (!this.data.type || !this.data.message) {
      this.showAlert('Tipo y mensaje son obligatorios.');
      return;
    }
    const myNickname = this.authService.getNickname();
    this.adminService.getAdmins().subscribe({
      next: (data: Admin[]) => {
        let createdBy = 0;
        const admin = data.find(a => a.person.nickname === myNickname);
        if (admin?.personId) {
          createdBy = admin.personId;
        }
        if (this.mode === 'one') {
          if (!this.selectedUserId) {
            this.showAlert('Selecciona un usuario');
            return;
          }
          const payload: Notification = {
            userId: this.selectedUserId,
            type: this.data.type,
            title: this.data.title,
            message: this.data.message,
            sentDate: Date.now().toString(),
            createdBy: createdBy
          };
          this.adminService.createNotification(payload).subscribe({
            next: () => {
              this.showAlert('Notificación enviada');
              this.reset();
            },
            error: () => this.showAlert('Error al enviar')
          });
        } else {
          const payload: Notification = {
            type: this.data.type,
            title: this.data.title,
            message: this.data.message,
            sentDate: Date.now().toString(),
            createdBy: createdBy
          };
          this.adminService.createNotifications(payload).subscribe({
            next: () => {
              this.showAlert('Notificaciones enviadas a todos');
              this.reset();
            },
            error: () => this.showAlert('Error al enviar')
          });
        }
      },
      error: (err) => {
        console.error('Error al obtener admins', err);
        this.showAlert('Error al obtener datos del administrador');
      }
    });
  }

  async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  reset() {
    this.selectedUserId = null;
    this.data = {
      type: '',
      title: '',
      message: ''
    };
  }
}