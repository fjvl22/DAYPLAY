import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.css'
})
export class DeleteAccountComponent {
  showModal = false;
  form!: FormGroup;
  message: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      password: ['', Validators.required]
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

    this.auth.deleteAccount(this.form.value.password).subscribe({
      next: res => {
        this.message = res.message;
        this.showModal = false;
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      error: err => this.message = err.error?.message || 'Error al eliminar su cuenta'
    });
  }
}
