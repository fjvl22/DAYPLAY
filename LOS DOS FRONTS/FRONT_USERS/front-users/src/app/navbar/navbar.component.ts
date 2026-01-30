import { Component } from '@angular/core';
import { NavItem } from '../nav-item';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  navs: NavItem[] = [
    { label: '', path: '' },
    { label: '', path: '' },
    { label: '', path: '' }
  ];
}
