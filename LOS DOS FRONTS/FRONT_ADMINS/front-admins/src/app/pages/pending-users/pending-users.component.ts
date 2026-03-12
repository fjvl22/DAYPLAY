import { Component } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
import { UserPending } from '../../core/interfaces/user-pending';
import { CommonModule } from '@angular/common';
import { UserPendingView } from '../../core/interfaces/user-pending-view';

@Component({
  selector: 'app-pending-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-users.component.html',
  styleUrl: './pending-users.component.css'
})
export class PendingUsersComponent {
  pending: UserPendingView[] = [];
  constructor(private admin: AdminService) {this.load();}
  load() {
    this.admin.getPendingUsers().subscribe((res: UserPending[]) => {
      const planFromStorage = localStorage.getItem('planType') || "";
      this.pending = res.map(user => ({
        ...user, planType: planFromStorage
      }));
    });
  }
  approve(id: number) {
    this.admin.approvePendingUser(id).subscribe(() => {this.load()});
  }
  reject(id: number) {
    this.admin.rejectPendingUser(id).subscribe(() => {this.load()});
  }
}
