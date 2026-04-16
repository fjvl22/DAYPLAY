import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { Game } from "src/app/interfaces/game";
import { RequestsService } from "src/app/services/requests.service";
import { Leaderboard } from "src/app/interfaces/leaderboard";
import { LeaderboardResponse } from "src/app/interfaces/leaderboard-response";
import { AppUser } from "src/app/interfaces/app-user";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss']
})
export class LeaderboardPage implements OnInit {

  games: Game[] = [];
  selectedGameId: number | null = null;

  leaderboardResponse!: LeaderboardResponse;

  sortBy: string = 'score';
  loading = false;

  currentUserNickname: string = '';

  leaderboardWithNicknames: any[] = [];

  usersCache: AppUser[] = [];

  constructor(public requests: RequestsService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    
    if (this.authService.isPending()) {
      this.router.navigate(['/']);
      return;
    }

    this.currentUserNickname = localStorage.getItem('nickname') || '';

    this.loadGames();
    this.loadUsers();
  }

  onGameChange(event: any) {
    const value = Number(event.detail.value);
    this.selectGame(value);
  }

  onSortChange(event: any) {
    const value = event.detail.value ?? 'score';
    this.changeSort(String(value));
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

  loadUsers() {
    this.requests.getUsers().subscribe({
      next: (res: AppUser[]) => {this.usersCache = res;},
      error: () => console.error('Error cargando usuarios')
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

  loadLeaderboard() {

    if (!this.selectedGameId) return;

    this.loading = true;

    this.requests.getLeaderboard(this.selectedGameId, this.sortBy)
      .subscribe({
        next: (res: LeaderboardResponse) => {

          this.leaderboardResponse = res;

          this.leaderboardWithNicknames = res.data.map(entry => {

            const user = this.usersCache.find(u => u.personId === entry.userId);

            return {...entry, nickname: user?.person.nickname || 'User'};
          });

          this.loading = false;
        },
        error: (err) => {
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

  isCurrentUser(nickname: string) {return nickname === this.currentUserNickname;}

  get leaderboard(): Leaderboard[] {return this.leaderboardResponse?.data || [];}
}