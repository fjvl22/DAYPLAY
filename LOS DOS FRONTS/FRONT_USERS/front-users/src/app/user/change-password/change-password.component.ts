import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Requests } from "../../services/requests";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {
  isResetFlow = false;
  currentPassword = '';
  newPassword = '';
  email = '';
  token: string | null = null;
  loading = false;
  message = '';
  error = '';

  constructor(private route: ActivatedRoute, private router: Router, private requests: Requests){}

  ngOnInit(): void {
    const path = this.route.snapshot.routeConfig?.path;
    this.isResetFlow = path === 'header' || path === 'login';
    if(path === 'header') this.token = this.route.snapshot.queryParamMap.get('token');
  }

  submit(){
    this.loading = true;
    this.error = '';
    this.message = '';
    if(this.isResetFlow){
      if(this.token){
        this.requests.resetPassword(this.token, this.newPassword).subscribe({
          next: res => {
            this.message = res.message;
            this.loading = false;
          },
          error: err => {
            this.error = err.error?.error || 'Error al resetear contraseña';
            this.loading = false;
          }
        });
      }else{
        this.requests.forgotPassword(this.email).subscribe({
          next: res => {
            this.message = res.message;
            this.loading = true;
          },
          error: err => {
            this.error = err.error?.error || 'Error al enviar email';
            this.loading = false;
          }
        });
      }
    }else{
      this.requests.changePassword(this.currentPassword, this.newPassword).subscribe({
        next: res => {
          this.message = res.message;
          this.loading = false;
        },
        error: err => {
          this.error = err.error?.error || 'Error al cambiar contraseña';
          this.loading = false;
        }
      });
    }
  }
}
