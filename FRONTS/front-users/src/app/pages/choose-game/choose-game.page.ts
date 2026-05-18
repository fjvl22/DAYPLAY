import { Component, OnInit } from "@angular/core";
import { Game } from "../../interfaces/game";
import { RequestsService } from "../../services/requests.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-choose-game',
  standalone: true,
  imports: [
    CommonModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon
  ],
  templateUrl: './choose-game.page.html',
  styleUrls: ['./choose-game.page.scss']
})
export class ChooseGamePage implements OnInit {

  title: string = '';

  games: Game[] = [];
  grid: (Game | null)[][] = [];

  hoveredGame: Game | null = null;

  constructor(
    public authService: AuthService,
    public requests: RequestsService,
    private router: Router
  ) {}

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
      (err: unknown) => console.error(err)
    );
  }

  onCellClick(game: Game | null): void {

    if (!game) return;

    this.requests.createMatch(game.id).subscribe({
      next: (res) => {

        const streak = res.streak.currentStreak;

        switch (game.id) {
          case 1:
            this.router.navigate(['/hangman'], { state: { streak } });
            break;
          case 2:
            this.router.navigate(['/guesssecretnumber'], { state: { streak } });
            break;
          case 3:
            this.router.navigate(['/mathrush'], { state: { streak } });
            break;
          case 4:
            this.router.navigate(['/wordle'], { state: { streak } });
            break;
        }
      },
      error: err => console.error(err)
    });
  }

  goToRanking(): void {
    if (this.authService.isPending()) return;
    this.router.navigate(['/leaderboard']);
  }

  goToStory(): void {
    if (this.authService.isPending()) return;
    this.router.navigate(['/story']);
  }
}