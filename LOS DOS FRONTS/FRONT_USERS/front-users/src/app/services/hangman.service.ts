import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HangmanService {
  private secretWord: string = '';
  private usedLetters = new Set<string>();
  private progressSubject = new BehaviorSubject<number[]>([]);
  progress$ = this.progressSubject.asObservable();
  private remainingAttemptsSubject = new BehaviorSubject<number>(6);
  remainingAttempts$ = this.remainingAttemptsSubject.asObservable();
  private statusSubject = new BehaviorSubject<'playing' | 'won' | 'lost'>('playing');
  status$ = this.statusSubject.asObservable();
  start(word: string){
    this.secretWord = word.toUpperCase();
    this.usedLetters.clear();
    this.progressSubject.next(new Array(this.secretWord.length).fill(0));
    this.remainingAttemptsSubject.next(6);
    this.statusSubject.next('playing');
  }
  try(letter: string): number[]{
    if(this.statusSubject.value!=='playing') return this.progressSubject.value;
    letter = letter.toUpperCase();
    if(this.usedLetters.has(letter)) return this.progressSubject.value;
    this.usedLetters.add(letter);
    const result: number[] = [];
    let success = false;
    for(let a = 0; a < this.secretWord.length; a++){
      if(this.secretWord[a] === letter){
        result[a] = 1;
        success = true;
      }else{
        result[a] = 0;
      }
    }
    const currentProgress = this.progressSubject.value.map(
      (v, a) => v === 1 || result[a] === 1 ? 1 : 0
    );
    this.progressSubject.next(currentProgress);
    if(!success){
      this.remainingAttemptsSubject.next(
        this.remainingAttemptsSubject.value - 1
      );
    }
    if(currentProgress.every(v => v === 1)) this.statusSubject.next('won');
    if(this.remainingAttemptsSubject.value<=0) this.statusSubject.next('lost');
    return result;
  }
}