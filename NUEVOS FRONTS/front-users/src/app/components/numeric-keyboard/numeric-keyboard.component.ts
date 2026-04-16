import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-numeric-keyboard',
  standalone: true,
  imports: [
    CommonModule,
    IonButton
  ],
  templateUrl: './numeric-keyboard.component.html',
  styleUrls: ['./numeric-keyboard.component.scss']
})
export class NumericKeyboardComponent {

  @Output() keyPressed = new EventEmitter<string>();

  press(key: string) {
    this.keyPressed.emit(key);
  }
}