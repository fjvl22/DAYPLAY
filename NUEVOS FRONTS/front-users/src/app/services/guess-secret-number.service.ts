import { Injectable } from "@angular/core";
import { RequestsService } from "./requests.service";
import { Observable, map, switchMap, throwError } from "rxjs";
import { MessageResponse } from "../interfaces/message-response";

@Injectable({
  providedIn: 'root'
})
export class GuessSecretNumberService {
  private secretNumber: number = 0;
  private attempts: number = 0;
  private readonly maxAttempts: number = 5;
  private finished: boolean = false;
  private attemptsNumbers: number[] = [];

  constructor(private requests: RequestsService) {}

  startGame() {
    this.secretNumber = Math.floor(Math.random()*100)+1;
    this.attempts = 0;
    this.finished = false;
  }

  guess(number: number): 'low' | 'high' | 'correct' | 'gameover' {
    if (this.finished) return 'gameover';
    this.attempts++;
    this.attemptsNumbers.push(number);
    if (number < this.secretNumber) {
      if (this.attempts >= this.maxAttempts) this.finished = true;
      return this.finished ? 'gameover' : 'low';
    }
    if (number > this.secretNumber) {
      if (this.attempts >= this.maxAttempts) this.finished = true;
      return this.finished ? 'gameover' : 'high';
    }
    this.finished = true;
    return 'correct';
  }

  getAttempts(): number { return this.attempts; }
  getAttemptsNumbers(): number[] { return this.attemptsNumbers; }
  getRemainingAttempts(): number { return this.maxAttempts - this.attempts; }
  isFinished(): boolean { return this.finished; }
  getSecretNumber(): number { return this.secretNumber; }
  getScore(number: number): number | null {
    if (this.finished) {
      let result = this.guess(number);
      let score;
      if (result === 'correct') score = 1;
      else score = 0;
      return score;
    }
    return null;
  }

  finishGame(gameName: string, number: number): Observable<MessageResponse> {
    const extraData = {
      secretNumber: this.getSecretNumber(),
      attempts: this.getAttempts(),
      attemptsNumbers: this.getAttemptsNumbers()
    };
    return this.requests.getGames().pipe(
      map(games => {
        const game = games.find(g => g.name === gameName);
        if (!game) throw new Error(`Juego "${gameName}" no encontrado`);
        return game.id;
      }),
      switchMap(id => {
        const score = this.getScore(number);
        if (score === null) {
          return throwError(() => new Error('Score not available'));
        }
        return this.requests.finishMatch(id, score, extraData);
      })
    );
  }
}