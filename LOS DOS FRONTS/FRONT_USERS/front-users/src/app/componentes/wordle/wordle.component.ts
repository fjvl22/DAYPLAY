import { Component, OnInit } from '@angular/core';
import { WordleService } from '../../services/wordle.service';
import { GuessResult } from '../../interfaces/guess-result';

@Component({
  selector: 'app-wordle',
  standalone: true,
  imports: [],
  templateUrl: './wordle.component.html',
  styleUrl: './wordle.component.css'
})
export class WordleComponent implements OnInit {
  secretWord: string = '';
  
  rows = 6;
  cols = 5;

  currentRow = 0;
  currentCol = 0;

  grid: string[][] = [];
  cellStatus: ('' | 'correct' | 'present' | 'absent')[][] = [];

  usedLetters: string[] = [];
  keyClasses: { [letter: string]: string } = {};

  gameOver = false;

  constructor(private wordleService: WordleService) {}

  ngOnInit() {
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = Array(this.cols).fill('');
      this.cellStatus[i] = Array(this.cols).fill('');
    }
    this.wordleService.fetchWord().subscribe(w => {
      this.secretWord = w;
      this.wordleService.startGame(w);
    });
  }

  onLetter(letter: string) {
    if (this.gameOver) return;
    if (this.currentCol<this.cols) {
      this.grid[this.currentRow][this.currentCol] = letter;
      this.currentCol++;
    }
  }

  onBackspace() {
    if (this.gameOver) return;
    if (this.currentCol > 0) {
      this.currentCol--;
      this.grid[this.currentRow][this.currentCol] = '';
    }
  }

  onEnter() {
    if (this.gameOver) return;
    if (this.currentCol !== this.cols) return;
    const guessWord = this.grid[this.currentRow].join('');
    try {
      const result: GuessResult[] = this.wordleService.guess(guessWord);
      result.forEach((r, index)=>{
        this.cellStatus[this.currentRow][index] = r.status;
        this.keyClasses[r.letter] = r.status;
        if (this.usedLetters.includes(r.letter)) {
          this.usedLetters.push(r.letter);
        }
      });
      if (guessWord === this.secretWord) {
        this.gameOver = true;
        return;
      }
      this.currentRow++;
      this.currentCol = 0;
      if (this.currentRow === this.rows) {
        this.revealCorrectWord();
        this.gameOver = true;
      }
    } catch (e: any) {
      alert(e.message);
    }
  }

  private revealCorrectWord() {
    const lastRow = this.rows - 1;
    for (let i = 0; i < this.cols; i++) {
      this.grid[lastRow][i] = this.secretWord[i];
      this.cellStatus[lastRow][i] = 'correct';
    }
  }
}
