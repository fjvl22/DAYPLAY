import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { AdminService } from "src/app/core/services/admin.service";
import { SystemEvent } from "src/app/core/interfaces/system-event";

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './events.page.html'
})
export class EventsPage {

  events: SystemEvent[] = [];

  constructor(private admin: AdminService) {this.admin.getEvents().subscribe(res => this.events = res);}
}