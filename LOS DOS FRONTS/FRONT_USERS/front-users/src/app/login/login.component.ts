import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
    nickname: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  constructor(private router: Router){}
  @ViewChild('link') link!: ElementRef<HTMLLinkElement>;
  ngAfterViewInit(){

  }
  login() {
    if (this.loginForm.valid) {
      const { nickname } = this.loginForm.value;
      const exists = nickname === 'admin';
  
      if (exists) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/register']);
      }
    }
  }  
}
