import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonButtons
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonButtons
  ],
  templateUrl: './change-password.modal.component.html',
  styleUrls: ['./change-password.modal.component.scss']
})
export class ChangePasswordComponent {

  showModal = false;

  form: FormGroup;

  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService
  ) {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  openModal() {
    this.showModal = true;
    this.form.reset();
    this.message = null;
  }

  closeModal() {
    this.showModal = false;
  }

  submit() {

    if (this.form.invalid) return;

    const { currentPassword, newPassword } = this.form.value;

    this.auth.changePassword(currentPassword, newPassword).subscribe({

      next: () => {
        this.message = 'Contraseña cambiada correctamente';
        setTimeout(() => this.closeModal(), 800);
      },

      error: err => {
        this.message = err.error?.message || 'Error al cambiar la contraseña';
      }
    });
  }
}