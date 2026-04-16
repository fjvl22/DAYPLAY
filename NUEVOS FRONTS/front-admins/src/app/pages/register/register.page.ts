import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IonicModule } from "@ionic/angular";

import { AuthService } from "src/app/core/services/auth.service";
import { RegisterPayload } from "src/app/core/interfaces/register-payload";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage {

  registerForm = this.fb.group({
    nickname: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  register() {
    if (this.registerForm.invalid) return;

    const { nickname, email, password, confirmPassword } = this.registerForm.value;

    if (nickname && email && password) {

      if (password !== confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        return;
      }
  
      this.loading = true;
      this.errorMessage = '';
  
      const rp: RegisterPayload = { nickname, password, email };
  
      this.authService.register(rp).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Registro correcto';
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Error en el registro';
        }
      });

    }
  }
}