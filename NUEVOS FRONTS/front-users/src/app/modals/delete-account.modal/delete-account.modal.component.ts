import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
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
  selector: 'app-delete-account',
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
  templateUrl: './delete-account.modal.component.html',
  styleUrls: ['./delete-account.modal.component.scss']
})
export class DeleteAccountComponent {

  showModal = false;

  form: FormGroup;

  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router
  ) {

    this.form = this.fb.group({
      password: ['', Validators.required]
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

    this.auth.deleteAccount(this.form.value.password).subscribe({

      next: res => {
        this.message = res.message;
        this.showModal = false;

        localStorage.clear();
        this.router.navigate(['/login']);
      },

      error: err => {
        this.message = err.error?.message || 'Error al eliminar su cuenta';
      }
    });
  }
}