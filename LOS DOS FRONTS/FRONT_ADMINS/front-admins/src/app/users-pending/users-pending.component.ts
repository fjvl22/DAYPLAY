import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-users-pending',
  standalone: true,
  imports: [],
  templateUrl: './users-pending.component.html',
  styleUrl: './users-pending.component.css'
})
export class UsersPendingComponent implements OnInit {
  pendingUsers: any[] = [];
  constructor(private requests: RequestsService){}
  ngOnInit(): void {
    this.loadPendingUsers();
  }
  loadPendingUsers(){
    this.requests.getPendingUsers().subscribe({
      next: (res: any) => this.pendingUsers = res,
      error: (err) => console.error('Error al cargar pendientes: ', err)
    });
  }
  approve(userId: number){
    if(!confirm("¿Seguro que quieres aprobar a este usuario?")) return;
    this.requests.approveUser(userId).subscribe({
      next: () => {
        alert("Usuario aprobado");
        this.pendingUsers = this.pendingUsers.filter(u => u.personId !== userId);
      },
      error: (err) => alert("Error al aprobar usuario: "+err.message)
    });
  }
}
