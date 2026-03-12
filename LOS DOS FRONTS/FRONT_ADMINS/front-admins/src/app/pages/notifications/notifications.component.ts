import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Notification } from '../../core/interfaces/notification';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {

  data: Partial<Notification> = {
    userId: 0,
    type: '',
    title: '',
    message: ''
  };

  constructor(private admin: AdminService) {}

  create(): void {

    if (!this.data.message || !this.data.type) {
      alert('Mensaje y tipo son obligatorios');
      return;
    }

    this.admin.createNotification(this.data as Notification)
      .subscribe(() => {
        alert('Notificación enviada');
        this.data = {
          userId: 0,
          type: '',
          title: '',
          message: ''
        };
      });
  }
}
