import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordleService {
  private secretWord: string = '';
  private attemptsUsed = 0;
  private statusSubject = new BehaviorSubject<'playing' | 'won' | 'lost'>('playing');
  status$ = this.statusSubject.asObservable();
  private remainingAttemptsSubject = new BehaviorSubject<number>(6);
  remainingAttempts$ = this.remainingAttemptsSubject.asObservable();
  private resultsSubject = new BehaviorSubject<number[][]>([]);
  results$ = this.resultsSubject.asObservable();
  start(word: string){
    this.secretWord = word.toUpperCase();
    this.attemptsUsed = 0;
    this.statusSubject.next('playing');
    this.remainingAttemptsSubject.next(6);
    this.resultsSubject.next([]);
  }
  try(word: string): number[]{
    if(this.statusSubject.value!=='playing') return [];
    word = word.toUpperCase();
    if(word.length!==5) throw new Error('The word must have five letters');
    const result: number[] = [0, 0, 0, 0, 0];
    const usedLettersPlayer = new Set<string>();
    const usedLettersSecret = new Set<number>();
    for(let a = 0; a < 5; a++){
      if(word[a] === this.secretWord[a]){
        result[a] = 2;
        usedLettersPlayer.add(word[a]);
        usedLettersSecret.add(a);
      }
    }
    for(let a = 0; a < 5; a++){
      const letter = word[a];
      if(usedLettersPlayer.has(letter)) continue;
      for(let b = 0; b < 5; b++){
        if(
          !usedLettersSecret.has(b) &&
          letter === this.secretWord[b]
        ){
          result[a] = 1;
          usedLettersPlayer.add(letter);
          usedLettersSecret.add(b);
          break;
        }
      }
    }
    this.attemptsUsed++;
    this.remainingAttemptsSubject.next(6-this.attemptsUsed);
    this.resultsSubject.next([...this.resultsSubject.value, result]);
    const currentStatus = this.statusSubject.value;
    if (result.every(v => v === 2)) {
      this.statusSubject.next('won');
    } else if (this.attemptsUsed >= 6 && currentStatus === 'playing') {
      this.statusSubject.next('lost');
    }
    return result;
  }
}
