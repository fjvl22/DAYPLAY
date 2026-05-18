import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";

import { AdminService } from "src/app/core/services/admin.service";
import { SystemEvent } from "src/app/core/interfaces/system-event";

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss']
})
export class EventsPage implements OnInit {

  events: SystemEvent[] = [];
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;

    this.adminService.getEvents().subscribe({
      next: (res) => {
        this.events = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  getCategoryColor(category: string): string {
    const colors: any = {
      AUTH: 'medium',
      USER_MANAGEMENT: 'primary',
      GAME_MANAGEMENT: 'success',
      GAMEPLAY: 'tertiary',
      REWARDS: 'warning',
      PAYMENT: 'danger',
      NOTIFICATION: 'secondary',
      SYSTEM: 'dark'
    };

    return colors[category] || 'medium';
  }
}