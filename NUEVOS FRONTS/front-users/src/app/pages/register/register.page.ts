import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageResponse } from '../../interfaces/message-response';
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
  IonSelect,
  IonSelectOption,
  IonButton,
  IonText
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
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
    IonSelect,
    IonSelectOption,
    IonButton,
    IonText
  ],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {

  registerForm!: FormGroup;

  loading = false;
  errorMessage = '';
  successMessage = '';

  planTypes: string[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public auth: AuthService
  ) {}

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
      next: (res) => this.planTypes = res,
      error: () => this.errorMessage = 'Error cargando planes'
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