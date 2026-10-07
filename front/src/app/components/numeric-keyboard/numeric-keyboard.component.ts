import { Component, EventEmitter, Input, Output } from '@angular/core';
import { addIcons } from 'ionicons';
import { backspaceOutline, enterOutline } from 'ionicons/icons';

@Component({
  selector: 'app-numeric-keyboard',
  templateUrl: './numeric-keyboard.component.html',
  styleUrls: ['./numeric-keyboard.component.scss'],
  imports: [],
})
export class NumericKeyboardComponent {

  @Input() deleteEnabled: boolean = true;
  @Input() enterEnabled: boolean = true;

  @Output() numberPressed = new EventEmitter<number>();
  @Output() deletePressed = new EventEmitter<void>();
  @Output() enterPressed = new EventEmitter<void>();

  readonly row1: number[] = [1, 2, 3];
  readonly row2: number[] = [4, 5, 6];
  readonly row3: number[] = [7, 8, 9];

  constructor() { addIcons({ backspaceOutline, enterOutline }); }

  pressNumber(number: number): void { this.numberPressed.emit(number); }

  delete(): void {

    if (!this.deleteEnabled) return;

    this.deletePressed.emit();
  }

  enter(): void {

    if (!this.enterEnabled) return;

    this.enterPressed.emit();
  }
}
