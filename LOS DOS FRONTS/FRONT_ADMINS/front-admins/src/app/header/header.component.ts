import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  nickname: string = "USER";
  constructor(private router: Router){}
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
    // borrar token, localStorage, etc.
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
      // Llamada al backend
    }
  }
}
