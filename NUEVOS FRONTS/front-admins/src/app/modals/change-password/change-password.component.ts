import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonicModule, ModalController } from "@ionic/angular";
import { AuthService } from "src/app/core/services/auth.service";
import { ChangePasswordPayload } from "src/app/core/interfaces/change-password-payload";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {

  form!: FormGroup;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private modalCtrl: ModalController
  ) {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  submit() {
    if (this.form.invalid) return;

    const payload: ChangePasswordPayload = this.form.value;

    this.auth.changePassword(payload).subscribe({
      next: () => this.modalCtrl.dismiss(true),
      error: err => this.message = err.error?.message || 'Error'
    });
  }
}