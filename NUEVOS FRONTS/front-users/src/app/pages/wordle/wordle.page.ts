import { Component, OnInit } from "@angular/core";
import { WordleService } from "../../services/wordle.service";
import { GuessResult } from "../../interfaces/guess-result";
import { Router } from "@angular/router";
import { GameFinishService } from "../../services/game-finish.service";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";
import { LettersKeyboardComponent } from "../../components/letters-keyboard/letters-keyboard.component";
import { IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-wordle',
  standalone: true,
  imports: [
    CommonModule,
    LettersKeyboardComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
  ],
  templateUrl: './wordle.page.html',
  styleUrls: ['./wordle.page.scss']
})
export class WordlePage implements OnInit {

  secretWord: string = '';
  rows = 6;
  cols = 5;

  currentRow = 0;
  currentCol = 0;

  grid: string[][] = [];
  cellStatus: ('' | 'correct' | 'present' | 'absent')[][] = [];

  usedLetters: string[] = [];
  keyClasses: Record<string, string> = {};

  gameOver = false;

  constructor(
    public gameFinishService: GameFinishService,
    public wordleService: WordleService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initBoard();

    this.wordleService.fetchWord().subscribe(w => {
      this.secretWord = w;
      this.wordleService.startGame(w);
    });
  }

  private initBoard() {
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = Array(this.cols).fill('');
      this.cellStatus[i] = Array(this.cols).fill('');
    }
  }

  onLetter(letter: string) {
    if (!this.gameOver) this.addLetter(letter);
  }

  onBackspace() {
    if (!this.gameOver) this.removeLetter();
  }

  onEnter() {
    if (!this.gameOver) this.submitGuess();
  }

  private addLetter(letter: string) {
    if (this.currentCol < this.cols) {
      this.grid[this.currentRow][this.currentCol] = letter;
      this.currentCol++;
    }
  }

  private removeLetter() {
    if (this.currentCol > 0) {
      this.currentCol--;
      this.grid[this.currentRow][this.currentCol] = '';
    }
  }

  private submitGuess() {
    if (this.currentCol !== this.cols) return;

    const guessWord = this.grid[this.currentRow].join('');

    try {
      const result: GuessResult[] = this.wordleService.guess(guessWord);

      result.forEach((r, index) => {
        this.cellStatus[this.currentRow][index] = r.status;
        this.keyClasses[r.letter] = r.status;

        if (!this.usedLetters.includes(r.letter)) {
          this.usedLetters.push(r.letter);
        }
      });

      if (guessWord === this.secretWord || this.currentRow === this.rows - 1) {
        this.gameOver = true;

        if (guessWord !== this.secretWord) {
          this.revealCorrectWord();
        }

        this.finishGame();
        return;
      }

      this.currentRow++;
      this.currentCol = 0;

    } catch (e: unknown) {
      alert((e as Error).message);
    }
  }

  private revealCorrectWord() {
    const lastRow = this.rows - 1;

    for (let i = 0; i < this.cols; i++) {
      this.grid[lastRow][i] = this.secretWord[i];
      this.cellStatus[lastRow][i] = 'correct';
    }
  }

  private finishGame() {
    this.gameFinishService.setFinishAction(() => {
      this.wordleService.finishGame("WORDLE");
    });

    if (this.authService.isPending()) {
      this.router.navigate(['/choose-game']);
    } else {
      this.router.navigate(['/finish-screen']);
    }
  }
}