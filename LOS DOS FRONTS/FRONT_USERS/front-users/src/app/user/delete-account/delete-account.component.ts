import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from "../../../../node_modules/@angular/common/index";

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.css'
})
export class DeleteAccountComponent {
  deleteForm = new FormGroup({
    password: new FormControl('', Validators.required),
    confirm: new FormControl(false, Validators.requiredTrue)
  });
  constructor(private router: Router){}
  deleteAccount(){
    if(this.deleteForm.invalid){
      this.deleteForm.markAllAsTouched();
      return;
    }
    console.log('Formulario válido');
    console.log(this.deleteForm.value);
    // Llamada al backend
    alert('Cuenta marcada para eliminación');
    this.router.navigate(['/login']);
  }
}
