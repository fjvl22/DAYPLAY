import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  @Input() open: boolean = true;

  adminType = '';

  private permissionsMap: any = {
    GAME_ADMIN: ['users', 'pending-users', 'games', 'daily-rewards'],
    PAYMENT_ADMIN: ['payments', 'payments/:id'],
    EVENT_ADMIN: ['events'],
    NOTIF_ADMIN: ['notifications']
  };

  constructor(private auth: AuthService) {this.auth.adminType$.subscribe(type => {this.adminType = type;});}

  canSee(route: string): boolean {
    const allowed = this.permissionsMap[this.adminType] || [];
    return allowed.includes(route);
  }
}