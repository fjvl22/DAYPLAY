import { Injectable } from '@angular/core';
import { MathOperation } from '../interfaces/math-operation';
import { RequestsService } from './requests.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MathRushService {

  private operations: MathOperation[] = [];
  private currentIndex: number = 0;
  private score: number = 0;
  private finished: boolean = false;

  constructor(private requests: RequestsService) {}

  fetchDailyOperations(): Observable<MathOperation[]> {return this.requests.getMathOperations(1);}

  startGame(operations: MathOperation[]) {
    this.operations = operations;
    this.currentIndex = 0;
    this.score = 0;
    this.finished = false;
  }

  getCurrentOperation(): MathOperation | null {
    if (this.currentIndex < this.operations.length) {
      return this.operations[this.currentIndex];
    }
    return null;
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

  getScore(): number {return this.score;}

  getProgress(): number {return this.currentIndex;}

  isFinished(): boolean {return this.finished;}

  getTotalOperations(): number {return this.operations.length;}
}
