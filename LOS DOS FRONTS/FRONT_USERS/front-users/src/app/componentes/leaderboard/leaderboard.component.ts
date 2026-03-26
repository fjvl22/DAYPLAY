import { Component, OnInit } from "@angular/core";
import { Game } from "../../interfaces/game";
import { RequestsService } from "../../services/requests.service";
import { Leaderboard } from "../../interfaces/leaderboard";
import { LeaderboardResponse } from "../../interfaces/leaderboard-response";
import { CommonModule } from "@angular/common";
import { AppUser } from "../../interfaces/app-user";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class leaderboardComponent implements OnInit {
  games: Game[] = [];
  selectedGameId: number | null = null;
  leaderboardResponse!: LeaderboardResponse;
  sortBy: string = 'score';
  loading = false;
  currentUserNickname: string = '';
  leaderboardWithNicknames: any[] = [];

  constructor(public requests: RequestsService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isPending()) {
      this.router.navigate(['/']);
      return;
    }
    this.currentUserNickname = localStorage.getItem('nickname') || '';
    this.loadGames();
  }

  loadGames() {
    this.requests.getGames().subscribe({
      next: (res) => {
        this.games = res;
        if (this.games.length > 0) {
          this.selectedGameId = this.games[0].id;
          this.loadLeaderboard();
        }
      },
      error: () => console.error('Error cargando juegos')
    });
  }

  selectGame(gameId: number) {
    this.selectedGameId = gameId;
    this.loadLeaderboard();
  }

  changeSort(sortType: string) {
    this.sortBy = sortType;
    this.loadLeaderboard();
  }

  loadUsers(): AppUser[] {
    this.requests.getUsers().subscribe({
      next: (res: AppUser[]) => {return res;},
      error: () => {
        console.error('Error cargando usuarios de la app.');
      }
    });
    return [];
  }

  loadLeaderboard() {
    if (!this.selectedGameId) return;
    this.loading = true;
    this.requests.getLeaderboard(this.selectedGameId, this.sortBy)
      .subscribe({
        next: (res: LeaderboardResponse) => {
          this.leaderboardResponse = res;
          this.leaderboardWithNicknames = res.data.map(entry => {
            const user = this.loadUsers().find(u => u.personId === entry.userId);
            return {
              ...entry,
              nickname: user?.person.nickname || 'Desconocido'
            };
          });
          this.loading = false;
        },
        error: (err: unknown) => {
          console.error('Error cargando leaderboard', err);
          this.loading = false;
        }
      });
  }

  getMedal(index: number) {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '';
    }
  }

  isCurrentUser(nickname: string) {
    return nickname === this.currentUserNickname;
  }

  get leaderboard(): Leaderboard[] {
    return this.leaderboardResponse?.data || [];
  }
}