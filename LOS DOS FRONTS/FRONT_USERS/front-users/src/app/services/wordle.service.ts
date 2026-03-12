import { Injectable } from "@angular/core";
import { RequestsService } from "./requests.service";
import { Observable, map } from "rxjs";
import { GuessResult } from "../interfaces/guess-result";

@Injectable({
  providedIn: 'root'
})
export class WordleService {
  private secretWord: string = '';
  private attempts: string[] = [];
  private maxAttempts: number = 6;
  private hardMode: boolean = false;
  private requiredLetters: { [letter: string]: number } = {};

  constructor(private requests: RequestsService) {}

  setHardMode(enabled: boolean) {
    this.hardMode = enabled;
    this.requiredLetters = {};
  }

  fetchWord(): Observable<string> {
    return this.requests.getWordleWord().pipe(map(words=>words[Math.floor(Math.random()*words.length)].word.toLowerCase()));
  }

  startGame(word: string) {
    this.secretWord = word.toLowerCase();
    this.attempts = [];
    this.requiredLetters = {};
  }

  private countLetters(word: string): { [letter: string]: number } {
    const counts: { [letter: string]: number } = {};
    for (let l of word) counts[l] = (counts[l] || 0) + 1;
    return counts;
  }

  guess(word: string): GuessResult[] {
    word = word.toLowerCase();
    if (this.hardMode) {
      for (let letter in this.requiredLetters) {
        if ((word.match(new RegExp(letter, 'g'))?.length || 0) < this.requiredLetters[letter]) {
          throw new Error(`Debes usar la letra "${letter}" según pistas previas (Hard Mode).`);
        }
      }
    }
    this.attempts.push(word);
    const result: GuessResult[] = [];
    const secretCounts = this.countLetters(this.secretWord);
    word.split('').forEach((l, i)=>{
      if (l===this.secretWord[i]) {
        result[i] = { letter: l, status: 'correct' };
        secretCounts[l]--;
        if (this.hardMode) this.requiredLetters[l] = (this.requiredLetters[l] || 0) + 1;
      }
    });
    word.split('').forEach((l, i)=>{
      if (result[i]) return;
      if (secretCounts[l]>0) {
        result[i] = { letter: l, status: 'present' };
        secretCounts[l]--;
      } else {
        result[i] = { letter: l, status: 'absent' };
      }
    });
    return result;
  }

  getAttempts(): string[] {
    return this.attempts;
  }

  isWin(): boolean {
    return this.attempts.includes(this.secretWord);
  }

  isGameOver(): boolean {
    return this.isWin() || this.attempts.length >= this.maxAttempts;
  }
}