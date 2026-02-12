import { Component } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgIf } from "@angular/common";
import { Requests } from "../../services/requests";

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.css'
})
export class DeleteAccountComponent {
  
  deleteForm = new FormGroup({confirm: new FormControl(false, Validators.requiredTrue)});

  errorMessage = '';
  loading = false;

  constructor(private router: Router, private requests: Requests){}

  deleteAccount(){
    if(this.deleteForm.invalid){
      this.deleteForm.markAllAsTouched();
      return;
    }

    const token = localStorage.getItem('jwt_token');

    if(!token){
      this.errorMessage = 'No hay sesión activa';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.requests.deleteAccount(token).subscribe({
      next: () => {
        localStorage.clear();

        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.error || 'Error al eliminar la cuenta.';
        this.loading = false;
      }
    });
  }

  cancel() {this.router.navigate(['/home']);}
}