import { Component, OnInit } from '@angular/core';
import { Requests } from '../services/requests';

interface Game {
  id: number;
  name: string;
}

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  // ─────────────────────────────────────────────
  // Datos del usuario
  // ─────────────────────────────────────────────
  planType = localStorage.getItem('planType');
  isBasic = this.planType === 'BASIC';
  isPremium = this.planType === 'PREMIUM';

  // ─────────────────────────────────────────────
  // Navegación de juegos
  // ─────────────────────────────────────────────
  games: Game[] = [
    { id: 1, name: 'Ahorcado' },
    { id: 2, name: 'Guess Secret Number' },
    { id: 3, name: 'Math Rush' },
    { id: 4, name: 'Wordle' }
  ];
  selectedGame: Game = this.games[0];

  // ─────────────────────────────────────────────
  // Ranking
  // ─────────────────────────────────────────────
  rankings: any[] = [];
  loading = false;

  constructor(private requests: Requests) {}

  ngOnInit(): void {
    this.loadRanking();
  }

  // ─────────────────────────────────────────────
  // Cambiar de juego desde nav
  // ─────────────────────────────────────────────
  selectGame(game: Game): void {
    this.selectedGame = game;
    this.loadRanking();
  }

  // ─────────────────────────────────────────────
  // Cargar ranking desde backend
  // ─────────────────────────────────────────────
  loadRanking(): void {
    this.loading = true;
    this.rankings = [];

    this.requests.getRankingByGame(this.selectedGame.id).subscribe({
      next: (data) => {
        this.rankings = data;
        this.loading = false;
      },
      error: () => {
        this.rankings = [];
        this.loading = false;
      }
    });
  }
}
