import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageResponse } from '../../interfaces/message-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  planTypes: string[] = [];

  constructor(private router: Router, private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nickname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      plan: ['', Validators.required]
    });
    this.loadPlans();
  }

  loadPlans() {
    this.auth.getPlanTypes().subscribe({
      next: (res) => {
        this.planTypes = res;
      },
      error: () => {
        this.errorMessage = 'Error cargando planes';
      }
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { nickname, email, password, plan } = this.registerForm.value;

    localStorage.setItem('plan', plan);

    this.auth.register(nickname, password, email).subscribe({
      next: (res: MessageResponse) => {
        this.loading = false;
        this.successMessage = res.message;
        this.registerForm.reset();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error en registro';
      }
    });
  }
}
