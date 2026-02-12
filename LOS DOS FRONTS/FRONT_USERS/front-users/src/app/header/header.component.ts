import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Requests } from '../services/requests';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  nickname: string = "";
  constructor(private router: Router, private requests: Requests){this.nickname = requests.getNickname() || "USER";}
  optionSelected(event: Event){
    const value = (event.target as HTMLSelectElement).value;
    switch(value){
      case 'logout':
        this.logout();
        break;
      case 'password':
        this.changePassword();
        break;
      case 'delete':
        this.deleteAccount();
        break;
    }
    (event.target as HTMLSelectElement).value = '';
  }
  logout(){
    console.log('Cerrar sesión');
    this.requests.logout();
    this.router.navigate(['/login']);
  }
  changePassword(){
    console.log('Cambiar contraseña');
    this.router.navigate(['/change-password']);
  }
  deleteAccount(){
    const confirmDelete = confirm('¿Estás seguro de eliminar tu cuenta?');
    if(confirmDelete){
      console.log('Eliminar cuenta');
      const token = this.requests.getToken();
      if(!token){
        alert("No estás autenticado");
        return;
      }
      this.requests.deleteAccount(token).subscribe({
        next: () => {
          alert('Cuenta eliminada');
          this.requests.logout();
          this.router.navigate(['/register']);
        },
        error: (err) => {
          console.error(err);
          alert('Error al eliminar la cuenta');
        }
      });
    }
  }
}
