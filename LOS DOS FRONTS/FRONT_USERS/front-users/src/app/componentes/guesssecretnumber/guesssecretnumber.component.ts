import { Component, HostListener, OnInit } from "@angular/core";
import { GuessSecretNumberService } from "../../services/guess-secret-number.service";
import { Router } from "@angular/router";
import { GameFinishService } from "../../services/game-finish.service";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";
import { NumericKeyboardComponent } from "../numeric-keyboard/numeric-keyboard.component";

@Component({
    selector: 'app-guess-secret-number',
    standalone: true,
    imports: [CommonModule, NumericKeyboardComponent],
    templateUrl: './guesssecretnumber.component.html',
    styleUrls: ['./guesssecretnumber.component css']
})
export class GuessSecretNumberComponent implements OnInit {
    currentInput: string = '';
    message: string = '';

    constructor(public gameFinishService: GameFinishService, public service: GuessSecretNumberService, private router: Router, private authService: AuthService) {}

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
        const result = this.service.guess(Number(this.currentInput));
        if (result === 'correct') {
            this.message = "🎉 ¡Correcto!";
            this.finishGame();
        } else if (result === 'gameover') {
            this.message = `💀 Número: ${this.service.getSecretNumber()}`;
            this.finishGame();
        } else if (result === 'high') {
            this.message = "📈 Demasiado alto";
        } else if (result === 'low') {
            this.message = "📉 Demasiado bajo";
        }
        this.currentInput = '';
    }

    private finishGame() {
        this.gameFinishService.setFinishAction(() => {
            this.service.finishGame('ADIVINA NÚMERO SECRETO', Number(this.currentInput));
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
        if (event.key >= '0' && event.key <= '9') this.handleKey(event.key);
        if (event.key === 'Enter') this.submitGuess();
        if (event.key === 'Backspace') this.currentInput = this.currentInput.slice(0, -1);
    }
}