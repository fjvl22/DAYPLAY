import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AdminService } from "../../core/services/admin.service";
import { Game } from "../../core/interfaces/game";
import { GameWord } from "../../core/interfaces/game-word";
import { MathOperation } from "../../core/interfaces/math-operation";

@Component({
  selector: 'app-admin-games',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

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

  newOperation = {
    operation: '',
    result: '',
    gameId: 3,
    MathOptions: Array(4).fill(null).map(() => ({optionValue: ''}))
  };

  ngOnInit() {
    this.loadGames();
  }

  loadGames() {
    this.adminService.getGames().subscribe({
      next: (data) => {
        this.games = data;
        const hangman = this.games.find(g => g.name === 'Hangman');
        const wordle = this.games.find(g => g.name === 'Wordle');
        const math = this.games.find(g => g.name === 'Math Rush');
        if(hangman)this.newWord.gameId = hangman.id;
        if(math)this.newOperation.gameId = math.id;
      },
      error: (err) => console.error(err)
    });
  }

  selectTab(tab: 'hangman' | 'wordle' | 'math'){
    this.activeTab = tab;
    this.showForm = false;
    if(tab==='math') this.loadMathOperations();
  }

  loadMathOperations(){
    this.adminService.getMathOperations().subscribe({
      next: (data) => {this.mathOperations = data},
      error: (err) => console.error(err)
    });
  }

  addWord(){
    this.adminService.insertGameWord({
      gameId: this.newWord.gameId,
      word: this.newWord.word,
      language: this.newWord.language,
      active: true,
      creationDate: Date.now().toString()
    }).subscribe({
      next: () => {
        this.newWord.word = '';
        this.showForm = false;
      },
      error: (err) => console.error(err)
    });
  }

  addOperation(){
    this.adminService.insertMathOperation(this.newOperation).subscribe({
      next: () => {
        this.loadMathOperations();
        this.newOperation = {
          operation: '',
          result: '',
          gameId: 3,
          MathOptions: Array(4).fill(null).map(() => ({optionValue: ''}))
        };
        this.showForm = false;
      },
      error: (err) => console.error(err)
    });
  }
}