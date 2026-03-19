import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DeleteAccountComponent } from '../delete-account/delete-account.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  nickname = localStorage.getItem('nickname') || 'User';
  showDropdown = false;

  constructor(private auth: AuthService, private router: Router) {}

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  openDeleteAccount(deleteAccountComponent: DeleteAccountComponent) {
    deleteAccountComponent.openModal();
  }

  openChangePassword(changePasswordComponent: ChangePasswordComponent) {
    changePasswordComponent.openModal();
  }
}
