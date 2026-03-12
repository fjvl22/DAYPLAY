import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.css'
})
export class DeleteAccountComponent {
  password = '';
  constructor(private auth: AuthService, private router: Router) {}
  deleteAccount(): void {
    if (!this.password) {
      alert('Debes introducir tu contraseña');
      return;
    }
    if (!confirm('Esta acción es irreversible. ¿Seguro que quieres eliminar tu cuenta')) return;
    this.auth.deleteAccount(this.password).subscribe({
      next: () => {
        alert('Cuenta eliminada correctamente');
        this.auth.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('No se pudo eliminar la cuenta. Revisa tu contraseña.');
      }
    });
  }
}