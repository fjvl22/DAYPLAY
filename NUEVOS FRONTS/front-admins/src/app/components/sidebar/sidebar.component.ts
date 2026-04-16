import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  
  adminType = '';

  private permissionsMap: any = {
    GAME_ADMIN: ['users', 'pending-users', 'games', 'daily-rewards'],
    PAYMENT_ADMIN: ['payments', 'payments/:id'],
    EVENT_ADMIN: ['events'],
    NOTIF_ADMIN: ['notifications']
  };

  constructor(private auth: AuthService) {
    this.auth.adminType$.subscribe(type => {this.adminType = type;});
  }

  canSee(route: string): boolean {
    const allowed = this.permissionsMap[this.adminType] || [];
    return allowed.includes(route);
  }
}