import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonButton } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { IonIcon } from 'ionicons/components/ion-icon.js';
import { backspaceOutline, enterOutline } from 'ionicons/icons';

@Component({
  selector: 'app-letter-keyboard',
  standalone: true,
  templateUrl: './letter-keyboard.component.html',
  styleUrls: ['./letter-keyboard.component.scss'],
  imports: [IonButton, IonIcon],
})
export class LetterKeyboardComponent {

  @Input() deleteEnabled: boolean = true;
  @Input() enterEnabled: boolean = true;

  @Output() keyPressed = new EventEmitter<string>();
  @Output() deletePressed = new EventEmitter<void>();
  @Output() enterPressed = new EventEmitter<void>();
  
  readonly row1: string[] = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];

  readonly row2: string[] = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'];

  readonly row3: string[] = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  private pressedKeys: Set<string> = new Set();

  constructor() { addIcons({ backspaceOutline, enterOutline }); }

  pressKey(key: string): void {

    if (this.pressedKeys.has(key)) return;

    this.pressedKeys.add(key);

    this.keyPressed.emit(key);
  }

  delete(): void {

    if (!this.deleteEnabled) return;

    this.deletePressed.emit();
  }

  enter(): void {

    if (!this.enterEnabled) return;

    this.enterPressed.emit();
  }

  isPressed(key: string): boolean { return this.pressedKeys.has(key); }

  reset(): void { this.pressedKeys.clear(); }
}
