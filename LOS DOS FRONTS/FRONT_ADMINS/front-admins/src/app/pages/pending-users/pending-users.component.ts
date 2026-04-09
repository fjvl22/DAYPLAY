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
  planFromStorage: string = '';
  constructor(private admin: AdminService) {this.load();}
  load() {
    this.admin.getPendingUsers().subscribe((res: UserPending[]) => {
      this.planFromStorage = localStorage.getItem('planType') || "";
      this.pending = res.map(user => ({
        ...user, planType: this.planFromStorage
      }));
    });
  }
  approve(id: number) {
    this.admin.approveUserPending(id, this.planFromStorage).subscribe(() => {this.load()});
  }
  reject(id: number) {
    this.admin.rejectUserPending(id).subscribe(() => {this.load()});
  }
}
