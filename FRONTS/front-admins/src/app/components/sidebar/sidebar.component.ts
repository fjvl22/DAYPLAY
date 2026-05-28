import { Component, EventEmitter, Input, Output } from "@angular/core";
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

  @Input() pinned = false;
  @Output() pinnedChange = new EventEmitter<boolean>();

  visible = false;

  department = '';

  items = [
    { label: 'Usuarios', route: '/layout/users', departments: ['GAME'] },
    { label: 'Pendientes', route: '/layout/pending-users', departments: ['GAME'] },
    { label: 'Recompensas', route: '/layout/daily-game-rewards', departments: ['GAME'] },
    { label: 'Juegos', route: '/layout/games', departments: ['GAME'] },

    { label: 'Pagos', route: '/layout/payments', departments: ['PAYMENT'] },

    { label: 'Notificaciones', route: '/layout/notifications', departments: ['NOTIF'] },

    { label: 'Eventos', route: '/layout/events', departments: ['EVENT'] }
  ];

  constructor(private auth: AuthService) {
    this.auth.department$.subscribe(dep => { this.department = dep; });
  }

  canView(item: any): boolean { return item.departments.includes(this.department); }

  togglePinned() {
    this.pinned = !this.pinned;
    this.pinnedChange.emit(this.pinned);
  }

  showSidebar() {
    if (!this.pinned) this.visible = true;
  }

  hideSidebar() {
    if (!this.pinned) this.visible = false;
  }
}