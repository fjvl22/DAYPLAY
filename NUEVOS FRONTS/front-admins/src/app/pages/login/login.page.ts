import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { Router } from "@angular/router";

import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {

  loginForm;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      nickname: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { nickname, password } = this.loginForm.value;

    if (!nickname || !password) {
      this.loading = false;
      return;
    }

    this.auth.login(nickname, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message ? err?.error?.message : 'Error al iniciar sesión';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}