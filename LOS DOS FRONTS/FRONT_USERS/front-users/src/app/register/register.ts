import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Requests } from '../services/requests';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm!: FormGroup;
  constructor(private fb: FormBuilder, private requests: Requests){
    this.registerForm = this.fb.group({
      nickname: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      plan: ['basic', Validators.required]
    });
  }
  register(){
    if(this.registerForm.invalid) return;
    const { plan, ...userData } = this.registerForm.value;
    localStorage.setItem('plan', plan);
    this.requests.register(userData).subscribe({
      next: () => alert('Usuario registrado correctamente'),
      error: () => alert('Error al registrar usuario')
    });
  }
}
