import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameFinishService } from '../../services/game-finish.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-final-scren',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './final-scren.component.html',
  styleUrl: './final-scren.component.css'
})
export class FinalScrenComponent {
  constructor(private router: Router, public gameFinishService: GameFinishService) {}

  goToChooseGame() {this.router.navigate(['/choose-game']);}

  saveGame() {
    this.gameFinishService.executeFinishAction();
    this.gameFinishService.clear();
    this.router.navigate(['/choose-game']);
  }
}
