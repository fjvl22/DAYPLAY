import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-spanish-keyboard',
  standalone: true,
  imports: [],
  templateUrl: './spanish-keyboard.component.html',
  styleUrl: './spanish-keyboard.component.css'
})
export class SpanishKeyboardComponent {
  @Output() keyPress = new EventEmitter<string>();
  @Input() letterStates: Record<string, number> = {};
  keyboardRows: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];
  pressLetter(letter: string){
    if(letter==='⌫'){
      this.keyPress.emit('BACKSPACE');
      return;
    }
    this.keyPress.emit(letter);
  }
  getKeyClass(letter: string): string{
    const state = this.letterStates[letter];
    if(state===2) return 'correct';
    if(state===1) return 'present';
    if(state===0) return 'absent';
    return '';
  }
}
