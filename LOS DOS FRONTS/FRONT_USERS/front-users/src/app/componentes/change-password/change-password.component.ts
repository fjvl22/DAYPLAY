import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  showModal = false;
  form!: FormGroup;
  message: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService) {
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
    this.auth.changePassword(currentPassword, newPassword).subscribe({
      next: res => {},
      error: err => this.message = err.error?.message || 'Error al cambiar la contraseña'
    });
  }
}
