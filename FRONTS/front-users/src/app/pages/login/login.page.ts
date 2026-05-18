import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../interfaces/login-response';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonText
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  rememberMe = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      nickname: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onCheckboxChange(event: any) {
    this.rememberMe = event.detail.checked;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { nickname, password } = this.loginForm.value;

    this.auth.login(nickname, password, this.rememberMe).subscribe({
      next: (res: LoginResponse) => {
        localStorage.setItem('access-token', res.accessToken);
        localStorage.setItem('refresh-token', res.refreshToken);
        localStorage.setItem('nickname', nickname);

        this.loading = false;
        setTimeout(() => {this.successMessage = 'Redirigiendo a la página principal...';}, 3000);
        this.router.navigate(['/choose-game']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error en login';
      }
    });
  }
}