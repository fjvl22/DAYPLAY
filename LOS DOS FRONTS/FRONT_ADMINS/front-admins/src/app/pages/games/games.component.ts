import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Game } from '../../core/interfaces/game';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})
export class GamesComponent {

  games: Game[] = [];

  newGame: Partial<Game> = {
    name: '',
    description: '',
    url: ''
  };

  constructor(private admin: AdminService) {
    this.load();
  }

  load(): void {
    this.admin.getGames()
      .subscribe((res: Game[]) => this.games = res);
  }

  create(): void {

    if (!this.newGame.name || !this.newGame.description || !this.newGame.url) {
      alert('Todos los campos son obligatorios');
      return;
    }

    this.admin.createGame(this.newGame as Game)
      .subscribe(() => {
        this.newGame = { name: '', description: '', url: '' };
        this.load();
      });
  }

  delete(id: number): void {
    this.admin.deleteGame(id)
      .subscribe(() => this.load());
  }
}
