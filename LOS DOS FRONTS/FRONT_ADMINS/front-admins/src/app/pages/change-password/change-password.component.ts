import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  constructor(private auth: AuthService) {}
  change(): void {
    if (!this.currentPassword || !this.newPassword) {
      alert('Todos los campos son obligatorios');
      return;
    }
    this.auth.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe(()=>{
      alert('Contraseña actualizada');
      this.currentPassword = '';
      this.newPassword = '';
    });
  }
}