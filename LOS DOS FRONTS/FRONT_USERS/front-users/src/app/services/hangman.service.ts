import { Injectable } from '@angular/core';
import { RequestsService } from './requests.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HangmanService {
  private word: string = '';
  private guessedLetters: string[] = [];
  private maxErrors: number = 6;

  constructor(private requests: RequestsService) {}

  fetchWord(): Observable<string> {
    return this.requests.getHangmanWord().pipe(
      map(words => words[Math.floor(Math.random()*words.length)].word)
    );
  }

  startGame(word: string) {
    this.word = word.toLowerCase();
    this.guessedLetters = [];
  }

  guess(letter: string): boolean {
    letter = letter.toLowerCase();
    if (this.guessedLetters.includes(letter)) return false;
    else this.guessedLetters.push(letter);
    return this.word.includes(letter);
  }

  getMaskedWord(): string {
    return this.word.split('').map(l => this.guessedLetters.includes(l) ? l : '_').join('');
  }

  getErrors(): number {
    return this.guessedLetters.filter(l => !this.word.includes(l)).length;
  }

  isGameOver(): boolean {
    return this.getErrors() >= this.maxErrors || this.getMaskedWord() === this.word;
  }

  isWin(): boolean {
    return this.getMaskedWord() === this.word;
  }
}
