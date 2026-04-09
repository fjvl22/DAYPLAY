import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginResponse } from '../../core/interfaces/login-response';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  nickname = '';
  password = '';
  constructor(private auth: AuthService, private router: Router) {}
  login() {
    this.auth.login(this.nickname, this.password)
      .subscribe((res: LoginResponse) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/users']);
      });
  }
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
