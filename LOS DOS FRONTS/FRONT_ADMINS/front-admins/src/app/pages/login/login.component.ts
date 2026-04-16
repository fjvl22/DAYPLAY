import { Component } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

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

  login() {this.auth.login(this.nickname, this.password).subscribe(() => {this.router.navigate(['/users'])});}

  goToRegister() {this.router.navigate(['/register']);}
}