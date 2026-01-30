import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-spanish-keyboard',
  standalone: true,
  imports: [],
  templateUrl: './spanish-keyboard.component.html',
  styleUrl: './spanish-keyboard.component.css'
})
export class SpanishKeyboardComponent {
  @Output() keyPress = new EventEmitter<string>();
  keyboardRows: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];
  pressedLetters: Set<string> = new Set();
  pressLetter(letter: string){
    if(!this.pressedLetters.has(letter)){
      this.pressedLetters.add(letter);
      this.keyPress.emit(letter.toUpperCase());
    }
  }
  isPressed(letter: string): boolean{return this.pressedLetters.has(letter);}
  resetKeyboard(){this.pressedLetters.clear();}
}
