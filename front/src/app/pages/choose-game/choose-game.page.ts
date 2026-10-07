import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IonContent } from "@ionic/angular";
import { Game } from "../../interfaces/game";

@Component({
  selector: 'app-choose-game',
  templateUrl: 'choose-game.page.html',
  styleUrl: 'choose-game.page.scss',
  standalone: true,
  imports: [IonContent]
})
export class ChooseGamePage implements OnInit {

  games: Game[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadGames();
  }

  private loadGames(): void {
    this.userService.getGames().subscribe({
      next: (games: Game[]) => { this.games = games; },
      error: (error) => console.error(error)
    });
  }

  goToGame(game: Game): void {
    let name: string = game.name;
    switch (name) {
      case 'AHORCADO':
        this.router.navigate(['/hangman']);
        break;
      case 'MATH RUSH':
        this.router.navigate(['/mathrush']);
        break;
      case 'NÚMERO SECRETO':
        this.router.navigate(['/guesssecretnumber']);
        break;
      case 'WORDLE':
        this.router.navigate(['/wordle']);
        break;
    }
  }
}