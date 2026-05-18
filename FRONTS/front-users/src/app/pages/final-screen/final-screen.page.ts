import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameFinishService } from '../../services/game-finish.service';
import { CommonModule } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-final-screen',
  standalone: true,
  imports: [
    CommonModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton
  ],
  templateUrl: './final-screen.page.html',
  styleUrls: ['./final-screen.page.scss']
})
export class FinalScreenPage {

  constructor(
    private router: Router,
    public gameFinishService: GameFinishService
  ) {}

  goToChooseGame() {
    this.router.navigate(['/choose-game']);
  }

  saveGame() {
    this.gameFinishService.executeFinishAction();
    this.gameFinishService.clear();
    this.router.navigate(['/choose-game']);
  }
}