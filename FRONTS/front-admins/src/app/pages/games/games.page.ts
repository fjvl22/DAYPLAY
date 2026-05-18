import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { AdminService } from "src/app/core/services/admin.service";
import { Game } from "src/app/core/interfaces/game";
import { GameWord } from "src/app/core/interfaces/game-word";
import { MathOperation } from "src/app/core/interfaces/math-operation";

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './games.page.html'
})
export class GamesPage implements OnInit {

  constructor(private adminService: AdminService) {}

  games: Game[] = [];
  hangmanWords: GameWord[] = [];
  wordleWords: GameWord[] = [];
  mathOperations: MathOperation[] = [];

  showManager = false;
  showForm = false;

  activeTab: 'hangman' | 'wordle' | 'math' = 'hangman';

  newWord: GameWord = {
    id: 0,
    gameId: 0,
    word: '',
    language: 'es',
    active: true,
    creationDate: Date.now().toString()
  };

  newOperation: MathOperation = {
    operation: '',
    result: '',
    gameId: 3,
    MathOptions: Array(4).fill(null).map(() => ({ optionValue: '' }))
  };

  ngOnInit() {
    this.loadGames();
  }

  loadGames() {
    this.adminService.getGames().subscribe({
      next: (data) => {
        this.games = data;
        const hangman = this.games.find(g => g.name === 'Hangman');
        const math = this.games.find(g => g.name === 'Math Rush');
        if (hangman) this.newWord.gameId = hangman.id;
        if (math) this.newOperation.gameId = math.id;
      }
    });
  }

  onTabChange() {
    this.showForm = false;
    if (this.activeTab === 'math') this.loadMathOperations();
  }

  loadMathOperations() {
    this.adminService.getMathOperations().subscribe({next: (data) => this.mathOperations = data});
  }

  addWord() {
    this.adminService.insertGameWord({
      gameId: this.newWord.gameId,
      word: this.newWord.word,
      language: this.newWord.language,
      active: true,
      creationDate: Date.now().toString()
    }).subscribe(() => {
      this.newWord.word = '';
      this.showForm = false;
    });
  }

  addOperation() {
    this.adminService.insertMathOperation(this.newOperation).subscribe(() => {
      this.loadMathOperations();
      this.newOperation = {
        operation: '',
        result: '',
        gameId: 3,
        MathOptions: Array(4).fill(null).map(() => ({ optionValue: '' }))
      };
      this.showForm = false;
    });
  }
}