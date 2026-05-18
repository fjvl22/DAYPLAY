import { Injectable } from "@angular/core";
import { RequestsService } from "./requests.service";
import { Observable, map, switchMap } from "rxjs";
import { GuessResult } from "../interfaces/guess-result";
import { MessageResponse } from "../interfaces/message-response";

@Injectable({
  providedIn: 'root'
})
export class WordleService {
  private secretWord: string = '';
  private attempts: string[] = [];
  private resultsHistory: GuessResult[][] = [];
  private maxAttempts: number = 6;
  private hardMode: boolean = false;
  private requiredLetters: { [letter: string]: number } = {};

  constructor(private requests: RequestsService) {}

  setHardMode(enabled: boolean) {
    this.hardMode = enabled;
    this.requiredLetters = {};
  }

  fetchWord(): Observable<string> {
    return this.requests.getWordleWords().pipe(
      map(words => words[Math.floor(Math.random() * words.length)].word.toLowerCase())
    );
  }

  startGame(word: string) {
    this.secretWord = word.toLowerCase();
    this.attempts = [];
    this.resultsHistory = [];
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
    const result: GuessResult[] = [];
    const secretCounts = this.countLetters(this.secretWord);
    word.split('').forEach((l, i) => {
      if (l === this.secretWord[i]) {
        result[i] = { letter: l, status: 'correct' };
        secretCounts[l]--;
        if (this.hardMode) {
          this.requiredLetters[l] = (this.requiredLetters[l] || 0) + 1;
        }
      }
    });
    word.split('').forEach((l, i) => {
      if (result[i]) return;

      if (secretCounts[l] > 0) {
        result[i] = { letter: l, status: 'present' };
        secretCounts[l]--;
      } else {
        result[i] = { letter: l, status: 'absent' };
      }
    });
    this.attempts.push(word);
    this.resultsHistory.push(result);
    return result;
  }

  getAttempts(): string[] {
    return this.attempts;
  }

  getResultsHistory(): GuessResult[][] {
    return this.resultsHistory;
  }

  isWin(): boolean {
    return this.attempts.includes(this.secretWord);
  }

  isGameOver(): boolean {
    return this.isWin() || this.attempts.length >= this.maxAttempts;
  }

  finishGame(gameName: string): Observable<MessageResponse> {
    const extraData = {
      secretWord: this.secretWord,
      attempts: this.attempts,
      results: this.resultsHistory,
      numAttempts: this.attempts.length,
      hardMode: this.hardMode
    };
    return this.requests.getGames().pipe(
      map(games => {
        const game = games.find(g => g.name === gameName);
        if (!game) throw new Error(`Juego "${gameName}" no encontrado`);
        return game.id;
      }),
      switchMap(id => {
        const score = this.isWin() ? 1 : 0;
        return this.requests.finishMatch(id, score, extraData);
      })
    );
  }
}