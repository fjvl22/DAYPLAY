import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [],
})
export class SidebarComponent {

  isOpen = false;
  isFixed = false;

  @Output() fixedChange = new EventEmitter<boolean>();

  openMenu(): void { this.isOpen = true; }

  closeMenu(): void { if (!this.isFixed) this.isOpen = false; }

  toggleFixed(): void {
    this.isFixed = !this.isFixed;
    this.isOpen = this.isFixed;
  
    this.fixedChange.emit(this.isFixed);
  }

}
