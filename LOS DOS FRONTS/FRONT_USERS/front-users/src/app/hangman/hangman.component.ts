import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HangmanService } from '../services/hangman.service';
import { SpanishKeyboardComponent } from '../spanish-keyboard/spanish-keyboard.component';

@Component({
  selector: 'app-hangman',
  standalone: true,
  imports: [CommonModule, SpanishKeyboardComponent],
  templateUrl: './hangman.component.html',
  styleUrl: './hangman.component.css'
})
export class HangmanComponent implements OnInit {
  wordProgress: number[] = [];
  remainingAttempts = 6;
  status: 'playing' | 'won' | 'lost' = 'playing';
  secretWord = '';
  usedLetterStates: Record<string, number> = {};
  constructor(private hangmanService: HangmanService){}
  ngOnInit(){
    this.hangmanService.start(this.secretWord);
    this.hangmanService.progress$.subscribe(progress=>{
      this.wordProgress = progress;
    });
    this.hangmanService.remainingAttempts$.subscribe(attempts=>{
      this.remainingAttempts = attempts;
    });
    this.hangmanService.status$.subscribe(status=>{
      this.status = status;
    });
  }
  onKeyPress(letter: string){
    if(this.status!=='playing') return;
    if(letter==='BACKSPACE') return;
    const result = this.hangmanService.try(letter);
    if(result.some(v=>v===1)){
      this.usedLetterStates[letter] = 2;
    }else{
      this.usedLetterStates[letter] = 0;
    }
  }
  getDisplayedLetter(index: number): string{
    return this.wordProgress[index] === 1 ? this.secretWord[index] : '';
  }
  getImagePath(): string{
    return `assets/img${6-this.remainingAttempts}.png`;
  }
  @HostListener('window:keydonw', ['$event'])
  habdleKeyboard(event: KeyboardEvent){
    if(/^[a-zA-ZñÑ]$/.test(event.key)) this.onKeyPress(event.key.toUpperCase());
  }
}
