import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuesssecretnumberService {
  private secretNumber: number = 0;
  private remainingAttemptsSubject = new BehaviorSubject<number>(3);
  remainingAttempts$ = this.remainingAttemptsSubject.asObservable();
  private statusSubject = new BehaviorSubject<'playing' | 'won' | 'lost'>('playing');
  status$ = this.statusSubject.asObservable();
  private resultsSubject = new BehaviorSubject<number[]>([]);
  results$ = this.resultsSubject.asObservable();
  start(min: number = 1, max: number = 100){
    this.secretNumber = Math.floor(Math.random()*(max-min))+min;
    this.remainingAttemptsSubject.next(3);
    this.statusSubject.next('playing');
    this.resultsSubject.next([]);
  }
  try(num: number): number{
    if(this.statusSubject.value!=='playing') return 0;
    let result: number;
    if(num===this.secretNumber){
      result = 0;
      this.statusSubject.next(`won`);
    }else if(num<this.secretNumber){
      result = 1;
    }else{
      result = -1;
    }
    this.resultsSubject.next([...this.resultsSubject.value, result]);
    if(result!==0) this.remainingAttemptsSubject.next(this.remainingAttemptsSubject.value-1);
    if(this.remainingAttemptsSubject.value<=0&&result!==0) this.statusSubject.next('lost');
    return result;
  }
}
