import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GuessSecretNumberService {
  private secretNumber: number = 0;
  private attempts: number = 0;
  private readonly maxAttempts: number = 5;
  private finished: boolean = false;
  startGame() {
    this.secretNumber = Math.floor(Math.random()*100)+1;
    this.attempts = 0;
    this.finished = false;
  }
  guess(number: number): 'low' | 'high' | 'correct' | 'gameover' {
    if (this.finished) return 'gameover';
    this.attempts++;
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
  getAttempts(): number {
    return this.attempts;
  }
  getRemainingAttempts(): number {
    return this.maxAttempts - this.attempts;
  }
  isFinished(): boolean {
    return this.finished;
  }
  getSecretNumber(): number {
    return this.secretNumber;
  }
}