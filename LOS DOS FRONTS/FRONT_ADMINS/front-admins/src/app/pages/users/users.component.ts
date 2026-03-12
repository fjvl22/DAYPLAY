import { Component } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
import { AppUser } from '../../core/interfaces/app-user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users: AppUser[] = [];
  constructor(private admin: AdminService) {this.load();}
  load() {
    this.admin.getUsers().subscribe((res: AppUser[]) => {this.users = res;});
  }
  delete(id: number) {
    if (!confirm('¿Seguro?')) return;
    this.admin.deleteUser(id).subscribe(() => {this.load();}); 
  }
}
