import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DeleteAccountComponent } from '../delete-account/delete-account.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, DeleteAccountComponent, ChangePasswordComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  nickname = localStorage.getItem('nickname') || 'User';
  showDropdown = false;
  deleteAccount!: DeleteAccountComponent;
  changePassword!: ChangePasswordComponent;

  constructor(public auth: AuthService, private router: Router) {}

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

  onSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
  
    if (value === 'logout') this.logout();
    else if (value === 'delete') this.openDeleteAccount(this.deleteAccount);
    else if (value === 'change') this.openChangePassword(this.changePassword);
  }
}
