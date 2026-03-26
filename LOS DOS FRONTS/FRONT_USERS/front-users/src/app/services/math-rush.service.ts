import { Injectable } from "@angular/core";
import { MathOperation } from "../interfaces/math-operation";
import { RequestsService } from "./requests.service";
import { Observable, map, switchMap, throwError } from "rxjs";
import { MessageResponse } from "../interfaces/message-response";

@Injectable({
  providedIn: 'root'
})
export class MathRushService {
  private operations: MathOperation[] = [];
  private currentIndex: number = 0;
  private score: number = 0;
  private finished: boolean = false;

  constructor(private requests: RequestsService) {}

  fetchDailyOperations(): Observable<MathOperation[]> {
    return this.requests.getMathOperations(1);
  }

  startGame(operations: MathOperation[]) {
    this.operations = operations;
    this.currentIndex = 0;
    this.score = 0;
    this.finished = false;
  }

  getCurrentOperation(): MathOperation | null {
    return this.currentIndex < this.operations.length ? this.operations[this.currentIndex] : null;
  }

  submitAnswer(answer: number): boolean {
    if (this.finished) return false;
    const currentOperation = this.getCurrentOperation();
    if (!currentOperation) return false;
    const correct = Number(currentOperation.result) === answer;
    if (correct) this.score++;
    this.currentIndex++;
    if (this.currentIndex >= this.operations.length) this.finished = true;
    return correct;
  }

  getScore(): number { return this.score; }
  getProgress(): number { return this.currentIndex; }
  isFinished(): boolean { return this.finished; }
  isWin(): boolean { return this.isFinished() && this.getScore() > 0 }
  getTotalOperations(): number { return this.operations.length; }

  finishGame(gameName: string, number: number): Observable<MessageResponse> {
    const extraData = {
      totalOperations: this.getTotalOperations(),
      correctAnswers: this.getScore(),
      wrongAnswers: this.getTotalOperations() - this.getScore(),
      finished: this.isFinished()
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