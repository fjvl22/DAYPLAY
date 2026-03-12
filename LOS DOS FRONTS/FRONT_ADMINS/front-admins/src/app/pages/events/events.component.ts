import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {
  events: any[] = [];
  constructor(private admin: AdminService) {
    this.admin.getEvents().subscribe((res: any) => {this.events = res});
  }
}
