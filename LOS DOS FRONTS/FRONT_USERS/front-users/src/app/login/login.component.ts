import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Requests } from '../services/requests';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm = new FormGroup({
    nickname: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  errorMessage: string = '';

  constructor(private router: Router, private requests: Requests) {}

  login() {
    if (this.loginForm.invalid) return;
    const nickname: string = this.loginForm.value.nickname!;
    const password: string = this.loginForm.value.password!;

    this.requests.login(nickname, password).subscribe({
      next: (res) => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.error || 'Error al iniciar sesión';
      }
    });
  }
}
