import { Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [IonicModule, SidebarComponent, TopbarComponent, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {}