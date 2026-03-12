import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  menuOpen = false;
  constructor(private auth: AuthService, private router: Router) {}
  getAdminType(): string {
    return this.auth.getAdminType();
  }
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  goToChangePassword(): void {
    this.menuOpen = false;
    this.router.navigate(['/change-password']);
  }
  goToDeleteAccount(): void {
    this.menuOpen = false;
    this.router.navigate(['/delete-account']);
  }
}