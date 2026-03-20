import { Component, OnInit } from "@angular/core";
import { Game } from "../../interfaces/game";
import { RequestsService } from "../../services/requests.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-choose-game',
  standalone: true,
  imports: [],
  templateUrl: './choose-game.component.html',
  styleUrl: './choose-game.component.css'
})
export class ChooseGameComponent implements OnInit {

  title: string = '';

  games: Game[] = [];
  grid: (Game | null)[][] = [];

  hoveredGame: Game | null = null;

  constructor(private requests: RequestsService, private router: Router) {}

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.requests.getGames().subscribe(
      (games: Game[]) => {
        this.games = games;

        this.grid = [
          [games[0] || null, games[1] || null],
          [games[2] || null, games[3] || null]
        ];
      },
      (err: any) => console.error(err)
    );
  }

  onCellClick(game: Game | null): void {
    if (!game) return;

    this.requests.createMatch(game.id).subscribe({
      next: () => {
        switch (game.id) {
          case 1:
            this.router.navigate(['/hangman']);
            break;
          case 2:
            this.router.navigate(['/guesssecretnumber']);
            break;
          case 3:
            this.router.navigate(['/mathrush']);
            break;
          case 4:
            this.router.navigate(['/wordle']);
            break;
          default:
            console.log('Incorrect gameId');
        }
      },
      error: err => console.error(err)
    });
  }

  onMouseEnter(game: Game | null): void {
    if (!game) return;
    this.hoveredGame = game;
  }

  onMouseLeave(): void {
    this.hoveredGame = null;
  }

  goToRakning(): void {
    this.router.navigate(['/ranking']);
  }
}