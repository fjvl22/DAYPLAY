import { Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { RouterOutlet } from "@angular/router";
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [IonicModule, RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {}