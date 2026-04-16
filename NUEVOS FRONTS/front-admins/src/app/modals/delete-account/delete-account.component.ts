import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonicModule, ModalController } from "@ionic/angular";
import { AuthService } from "src/app/core/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './delete-account.component.html'
})
export class DeleteAccountComponent {

  form!: FormGroup;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private modalCtrl: ModalController,
    private router: Router
  ) {
    this.form = this.fb.group({password: ['', Validators.required]});
  }

  close() {
    this.modalCtrl.dismiss();
  }

  submit() {
    if (this.form.invalid) return;

    this.auth.deleteAccount(this.form.value.password).subscribe({
      next: (res) => {
        localStorage.clear();
        this.modalCtrl.dismiss(true);
        this.router.navigate(['/login']);
      },
      error: err => this.message = err.error?.message || 'Error'
    });
  }
}