import { Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";
import { Router } from "@angular/router";
import { DeleteAccountComponent } from "../../pages/delete-account/delete-account.component";
import { ChangePasswordComponent } from "../../pages/change-password/change-password.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, DeleteAccountComponent, ChangePasswordComponent],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  showDropdown = false;
  @ViewChild(DeleteAccountComponent) deleteAccount!: DeleteAccountComponent;
  @ViewChild(ChangePasswordComponent) changePassword!: ChangePasswordComponent;
  constructor(public auth: AuthService, private router: Router, private eRef: ElementRef) {}
  get nickname(): string {return this.auth.getNickname();}
  toggleDropdown() {this.showDropdown = !this.showDropdown;}
  logout() {
    this.showDropdown = false;
    this.auth.logout().subscribe({
      next: () => {
        localStorage.clear();
      }
    });
    this.router.navigate(['/login']);
  }
  openDeleteAccount() {
    this.showDropdown = false;
    this.deleteAccount?.openModal();
  }
  openChangePassword() {
    this.showDropdown = false;
    this.changePassword?.openModal();
  }
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
}