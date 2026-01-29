import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.css'
})
export class DeleteAccountComponent {
  deleteForm = new FormGroup({confir: new FormControl(false, Validators.requiredTrue)});
  constructor(private router: Router){}
  deleteAccount(){
    if(this.deleteForm.invalid){
      this.deleteForm.markAllAsTouched();
      return;
    }
    console.log('Cuenta eliminada');
    // Llamada al backend
     alert('Cuenta eliminada definitivamente');
     this.router.navigate(['/login']);
  }
}
