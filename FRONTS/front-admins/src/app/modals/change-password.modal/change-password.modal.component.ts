import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonicModule, ModalController } from "@ionic/angular";
import { AuthService } from "src/app/core/services/auth.service";
import { ChangePasswordPayload } from "src/app/core/interfaces/change-password-payload";
import { Router } from "@angular/router";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './change-password.modal.component.html',
})
export class ChangePasswordComponent {

  form: FormGroup;
  message: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private modalCtrl: ModalController,
    private router: Router
  ) {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validators: (form) => {
        const current = form.get('currentPassword')?.value;
        const next = form.get('newPassword')?.value;
        return current === next ? { samePassword: true } : null;
      }
    });

    this.form.valueChanges.subscribe(() => {
      this.message = null;
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    const payload: ChangePasswordPayload = this.form.value;

    this.auth.changePassword(payload).subscribe({
      next: () => {
        this.loading = false;
        this.modalCtrl.dismiss(true);
        localStorage.removeItem('accessToken');
        this.modalCtrl.dismiss(true);
        this.router.navigate(['/login']);
      },
      error: err => {
        this.loading = false;
        this.message = err.error?.message || 'Error';
      }
    });
  }
}