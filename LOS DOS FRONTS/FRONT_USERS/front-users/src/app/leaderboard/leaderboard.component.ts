import { Component, OnInit } from '@angular/core';
import { Game } from '../interfaces/game';
import { Leaderboard } from '../interfaces/leaderboard';
import { RequestsService } from '../services/requests.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  games: Game[] = [];
  selectedGameId: number | null = null;
  leaderboard: Leaderboard[] = [];
  sortBy: string = 'score';
  loading = false;
  currentUserNickname: string = '';
  constructor(private requests: RequestsService) {}
  ngOnInit(): void {
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
  loadLeaderboard() {
    if (!this.selectedGameId) return;
    this.loading = true;
    this.requests.getLeaderboard(this.selectedGameId, this.sortBy)
    .subscribe({
      next: (res) => {
        this.leaderboard = res;
        this.loading = false;
      },
      error: () => this.loading = false
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
}
