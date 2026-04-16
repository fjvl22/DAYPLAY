import { Component, HostListener, OnInit } from "@angular/core";
import { GuessSecretNumberService } from "../../services/guess-secret-number.service";
import { Router } from "@angular/router";
import { GameFinishService } from "../../services/game-finish.service";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";
import { NumericKeyboardComponent } from "../../components/numeric-keyboard/numeric-keyboard.component";

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-guess-secret-number',
  standalone: true,
  imports: [
    CommonModule,
    NumericKeyboardComponent,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton
  ],
  templateUrl: './guess-secret-number.page.html',
  styleUrls: ['./guess-secret-number.page.scss']
})
export class GuessSecretNumberPage implements OnInit {

  currentInput: string = '';
  message: string = '';

  constructor(
    public gameFinishService: GameFinishService,
    public service: GuessSecretNumberService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.service.startGame();
  }

  handleKey(key: string) {

    if (this.service.isFinished()) return;

    if (key === 'C') {
      this.currentInput = '';
      return;
    }

    if (key >= '0' && key <= '9' && this.currentInput.length < 3) {
      this.currentInput += key;
    }
  }

  submitGuess() {

    if (!this.currentInput || this.service.isFinished()) return;

    const number = Number(this.currentInput);

    const result = this.service.guess(number);

    if (result === 'correct') {
      this.message = "🎉 ¡Correcto!";
      this.finishGame(number);
    }

    else if (result === 'gameover') {
      this.message = `💀 Número: ${this.service.getSecretNumber()}`;
      this.finishGame(number);
    }

    else if (result === 'high') {
      this.message = "📈 Demasiado alto";
    }

    else if (result === 'low') {
      this.message = "📉 Demasiado bajo";
    }

    this.currentInput = '';
  }

  private finishGame(finalGuess: number) {

    this.gameFinishService.setFinishAction(() => {
      this.service.finishGame('ADIVINA NÚMERO SECRETO', finalGuess);
    });

    if (this.authService.isPending()) {
      this.router.navigate(['/choose-game']);
    } else {
      this.router.navigate(['/finish-screen']);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if (this.service.isFinished()) return;

    if (event.key >= '0' && event.key <= '9') {
      this.handleKey(event.key);
    }

    if (event.key === 'Enter') {
      this.submitGuess();
    }

    if (event.key === 'Backspace') {
      this.currentInput = this.currentInput.slice(0, -1);
    }
  }
}