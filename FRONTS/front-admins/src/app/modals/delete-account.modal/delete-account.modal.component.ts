import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonicModule, ModalController } from "@ionic/angular";
import { Router } from "@angular/router";
import { AdminService } from "src/app/core/services/admin.service";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './delete-account.modal.component.html'
})
export class DeleteAccountComponent {

  form: FormGroup;
  message: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private admin: AdminService,
    private auth: AuthService,
    private modalCtrl: ModalController,
    private router: Router
  ) {
    this.form = this.fb.group({
      password: ['', Validators.required]
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

    this.auth.deleteAccount(this.form.value.password).subscribe({
      next: () => {

        this.loading = false;

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