import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../interfaces/login-response';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private router: Router, private fb: FormBuilder, public auth: AuthService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      nickname: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { nickname, password } = this.loginForm.value;

    this.auth.login(nickname, password).subscribe({
      next: (res: LoginResponse) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('nickname', nickname);
        this.loading = false;
        this.router.navigate(['/choose-game']);
        console.log('Correct login');
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error en login';
      }
    });
  }
}
