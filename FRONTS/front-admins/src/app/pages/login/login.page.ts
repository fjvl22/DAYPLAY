import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/services/auth.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { LoginPayload } from "src/app/core/interfaces/login-payload";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  form!: FormGroup;
  loading = false;
  error = '';
  rememberMe = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nickname: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onRemember(e: any) {
    this.rememberMe = e.detail.checked;
  }

  private getDefault(dep: string): string {
    const map: Record<string, string> = {
      GAME: '/layout/users',
      PAYMENT: '/layout/payments',
      EVENT: '/layout/events',
      NOTIF: '/layout/notifications'
    };

    return map[dep] ?? '/login';
  }

  login() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    const payload: LoginPayload = {
      nickname: this.form.value.nickname,
      password: this.form.value.password,
      rememberMe: this.form.value.rememberMe
    };

    this.auth.login(payload).subscribe({
      next: () => {
        this.loading = false;

        const dep = this.auth.getDepartment();

        if (!dep) {
          this.router.navigate(['/login']);
          return;
        }

        this.router.navigate([this.getDefault(dep)]);
      },
      error: (err) => {
        this.loading = false;

        this.error = err.error?.message ?? err.message ?? 'Error en el login';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}