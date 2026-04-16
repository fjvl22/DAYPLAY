import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener
} from '@angular/core';

import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-letters-keyboard',
  standalone: true,
  imports: [
    CommonModule,
    IonButton
  ],
  templateUrl: './letters-keyboard.component.html',
  styleUrls: ['./letters-keyboard.component.scss']
})
export class LettersKeyboardComponent {

  @Input() usedLetters: string[] = [];
  @Input() keyClasses: { [letter: string]: string } = {};
  @Input() gameMode: 'hangman' | 'wordle' = 'hangman';

  @Output() letterPressed = new EventEmitter<string>();
  @Output() backspacePressed = new EventEmitter<void>();
  @Output() enterPressed = new EventEmitter<void>();

  keys: string[][] = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M']
  ];

  pressKey(key: string) {
    this.letterPressed.emit(key);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    const key = event.key.toLowerCase();

    if (this.gameMode === 'hangman') {
      if (/^[a-z]$/.test(key) && !this.usedLetters.includes(key)) {
        this.letterPressed.emit(key);
      }
    }

    if (this.gameMode === 'wordle') {
      if (/^[a-z]$/.test(key)) {
        this.letterPressed.emit(key);
      } else if (key === 'backspace') {
        this.backspacePressed.emit();
      } else if (key === 'enter') {
        this.enterPressed.emit();
      }
    }
  }
}