import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { AdminService } from "src/app/core/services/admin.service";
import { UserPending } from "src/app/core/interfaces/user-pending";
import { UserPendingView } from "src/app/core/interfaces/user-pending-view";

@Component({
  selector: 'app-pending-users',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './pending-users.page.html'
})
export class PendingUsersPage {

  pending: UserPendingView[] = [];
  planFromStorage: string = '';

  constructor(private admin: AdminService) {this.load();}

  load() {
    this.admin.getPendingUsers().subscribe((res: UserPending[]) => {
      this.planFromStorage = localStorage.getItem('planType') || "";
      this.pending = res.map(user => ({
        ...user,
        planType: this.planFromStorage
      }));
    });
  }

  approve(id: number) {
    this.admin.approveUserPending(id, this.planFromStorage).subscribe(() => this.load());
  }

  reject(id: number) {
    this.admin.rejectUserPending(id).subscribe(() => this.load());
  }
}