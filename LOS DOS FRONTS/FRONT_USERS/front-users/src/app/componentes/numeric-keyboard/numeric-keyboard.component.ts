import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-numeric-keyboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './numeric-keyboard.component.html',
  styleUrl: './numeric-keyboard.component.css'
})
export class NumericKeyboardComponent {
  @Output() keyPressed = new EventEmitter<string>();
  press(key: string) {this.keyPressed.emit(key);}
}
