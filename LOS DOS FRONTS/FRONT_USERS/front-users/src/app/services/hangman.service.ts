import { Injectable } from "@angular/core";
import { RequestsService } from "./requests.service";
import { Observable, map, switchMap, throwError } from "rxjs";
import { MessageResponse } from "../interfaces/message-response";

@Injectable({
  providedIn: 'root'
})
export class HangmanService {
  private word: string = '';
  private guessedLetters: string[] = [];
  private maxErrors: number = 6;
  private attempts: number = 0;

  constructor(private requests: RequestsService) {}

  fetchWord(): Observable<string> {
    return this.requests.getHangmanWords().pipe(map(words => words[Math.floor(Math.random()*words.length)].word));
  }

  startGame(word: string) {
    this.word = word.toLowerCase();
    this.guessedLetters = [];
  }

  guess(letter: string): boolean {
    this.attempts++;
    letter = letter.toLowerCase();
    if (this.guessedLetters.includes(letter)) return false;
    this.guessedLetters.push(letter);
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

  getGuessedLetters(): string[] {
    return this.guessedLetters;
  }

  getAttempts(): number {
    return this.attempts;
  }

  finishGame(gameName: string): Observable<MessageResponse> {
    const extraData = {
      secretWord: this.fetchWord(),
      attempts: this.getAttempts(),
      attemptsLetters: this.getGuessedLetters()
    };
    return this.requests.getGames().pipe(
      map(games => {
        const game = games.find(g => g.name === gameName);
        if (!game) throw new Error(`Juego "${gameName}" no encontrado`);
        return game.id;
      }),
      switchMap(id => {
        const score = this.isWin() ? 1 : 0;
        if (score === null) {
          return throwError(() => new Error('Score not available'));
        }
        return this.requests.finishMatch(id, score, extraData);
      })
    );
  }
}