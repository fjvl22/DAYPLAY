import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MathOperation } from '../math-operation';

@Injectable({
  providedIn: 'root'
})
export class MathrushService {
  private operations: MathOperation[] = [];
  private currentIndex = 0;
  private currentOperationSubject = new BehaviorSubject<MathOperation | null>(null);
  currentOperation$ = this.currentOperationSubject.asObservable();
  private punctuationSubject = new BehaviorSubject<number>(0);
  punctuation$ = this.punctuationSubject.asObservable();
  private statusSubject = new BehaviorSubject<'playing' | 'finished'>('playing');
  status$ = this.statusSubject.asObservable();
  start(){
    this.operations = this.generateOperations();
    this.currentIndex = 0;
    this.statusSubject.next('playing');
    this.currentOperationSubject.next(this.operations[0]);
  }
  answer(value: number){
    if(this.statusSubject.value!=='playing') return;
    const current = this.operations[this.currentIndex];
    if(String(value)===current.correct) this.punctuationSubject.next(this.punctuationSubject.value+1);
    this.currentIndex++;
    if(this.currentIndex>=10){
      this.statusSubject.next('finished');
      this.currentOperationSubject.next(null);
    }else{
      this.currentOperationSubject.next(this.operations[this.currentIndex]);
    }
  }
  private generateOperations(): MathOperation[]{
    const ops: MathOperation[] = [];
    for(let a = 0; a < 10; a++){
      const a = Math.floor(Math.random()*10);
      const b = Math.floor(Math.random()*10);
      const correct = (a+b).toString();
      const options = new Set<string>();
      options.add(correct);
      while(options.size<4) options.add((a+b+Math.floor(Math.random()*5)-2).toString());
      ops.push({
        operation: `${a}+${b}`,
        options: Array.from(options).sort(()=>Math.random()-0.5),
        correct
      });
    }
    return ops;
  }
}
