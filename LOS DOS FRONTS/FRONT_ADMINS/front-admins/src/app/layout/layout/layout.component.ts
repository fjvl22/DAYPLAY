import { Component } from "@angular/core";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { TopbarComponent } from "../topbar/topbar.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  sidebarOpen = false;

  hoverSidebar = false;

  openSidebar() {this.sidebarOpen = true;}

  closeSidebar() {this.sidebarOpen = false;}

  maybeClose() {if (!this.hoverSidebar) this.closeSidebar();}
}