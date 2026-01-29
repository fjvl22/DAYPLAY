import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    nickname: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  constructor(private router: Router){}
  @ViewChild('link') link!: ElementRef<HTMLLinkElement>;
  ngAfterViewInit(){

  }
  register(){
    if(this.registerForm.valid){
      console.log('User registered', this.registerForm.value);
      this.router.navigate(['login']);
    }
  }
}
