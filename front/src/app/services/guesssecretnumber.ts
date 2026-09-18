import { Service } from '@angular/core';

type Difficulty = 'EASY' | 'NORMAL' | 'HARD';
type Status = 'HIGHER' | 'LOWER' | 'CORRECT';

@Service()
export class Guesssecretnumber {
  private secretNumber!: number;
  private difficult!: Difficulty;
  private difficulties: Difficulty[] = ['EASY', 'NORMAL', 'HARD'];
  private maxAttempts!: number;
  private attempts: number = 0;
  private won!: boolean;
  private status!: Status;
  startGame(difficult: string) {
    this.difficulties.forEach((d) => {
        if (difficult==d) {
            switch (difficult) {
                case 'EASY':
                    this.secretNumber = Math.floor(Math.random()*10);
                    this.maxAttempts = 10;
                    break;
                case 'NORMAL':
                    this.secretNumber = Math.floor(Math.random()*100);
                    this.maxAttempts = 6;
                    break;
                case 'HARD':
                    this.secretNumber = Math.floor(Math.random()*1000);
                    this.maxAttempts = 3;
                    break;
            }
        }
    });
  }
  public guess(x: number): Status {
    if (x===this.secretNumber) return 'CORRECT';
    else if (x<this.secretNumber) return 'HIGHER';
    else return 'LOWER';
  }
  public getSecretNumber(): number { return this.secretNumber; }
  public isWon(x: number): boolean { return this.guess(x) === 'CORRECT'; }
  public isLost(): boolean { return this.attempts === this.maxAttempts; }
}
