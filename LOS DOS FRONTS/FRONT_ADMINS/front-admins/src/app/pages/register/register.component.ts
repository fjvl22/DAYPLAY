import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../core/services/auth.service";
import { Router } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm = this.fb.group({
    nickname: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });
  errorMessage = '';
  loading = false;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}
  register() {
    if (this.registerForm.invalid) return;
    const { nickname, email, password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    if (!nickname || !email || !password) return;
    this.authService.register({ nickname, email, password }).subscribe({
      next: (res) => {
        console.log(res);
        this.loading = false;
        alert('Registro correcto. Será redirigido al login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error en el registro';
      }
    });
  }
}