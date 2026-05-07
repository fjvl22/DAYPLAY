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
  successMessage = '';
  errorMessage = '';
  rememberMe = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    console.log('l');
    this.loginForm = this.fb.group({
      nickname: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onCheckboxChange(event: any) {
    this.rememberMe = event.detail.checked;
  }

  login() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const { nickname, password } = this.loginForm.value;

    if (!nickname || !password) {
      this.loading = false;
      return;
    }

    this.auth.login(nickname, password, this.rememberMe).subscribe({
      next: () => {
        this.loading = false;
        setTimeout(() => {this.successMessage = 'Redirigiendo a la página principal...';}, 3000);
        this.router.navigateByUrl('/users');
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message ? err?.error?.message : 'Error al iniciar sesión';
      }
    });
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  get nickname() {
    return this.loginForm.get('nickname');
  }
  
  get password() {
    return this.loginForm.get('password');
  }
}