import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ChangePasswordPayload } from '../../core/interfaces/change-password-payload';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  showModal = false;
  form!: FormGroup;
  message: string | null = null;

  constructor(private fb: FormBuilder, public auth: AuthService) {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  openModal() {
    this.showModal = true;
    this.form.reset();
    this.message = null;
  }

  closeModal() {
    this.showModal = false;
  }

  submit() {
    if (this.form.invalid) return;

    const { currentPassword, newPassword } = this.form.value;
    const payload: ChangePasswordPayload = {currentPassword, newPassword};
    this.auth.changePassword(payload).subscribe({
      next: res => {},
      error: err => this.message = err.error?.message || 'Error al cambiar la contraseña'
    });
  }
}
