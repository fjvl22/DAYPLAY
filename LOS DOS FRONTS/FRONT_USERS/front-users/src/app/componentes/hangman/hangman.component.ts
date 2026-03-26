import { Component, OnInit } from "@angular/core";
import { HangmanService } from "../../services/hangman.service";
import { Router } from "@angular/router";
import { GameFinishService } from "../../services/game-finish.service";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";
import { LettersKeyboardComponent } from "../letters-keyboard/letters-keyboard.component";

@Component({
    selector: 'app-hangman',
    standalone: true,
    imports: [CommonModule, LettersKeyboardComponent],
    templateUrl: './hangman.component.html',
    styleUrls: ['./hangman.component.css']
})
export class HangmanComponent implements OnInit {
    word: string = '';
    usedLetters: string[] = [];
    keyClasses: Record<string, string> = {};
    errorsCounter!: number;
    gameOver = false;

    constructor(public gameFinishService: GameFinishService, public hangmanService: HangmanService, private router: Router, private authService: AuthService) {}

    ngOnInit() {
        this.hangmanService.fetchWord().subscribe(w => {
            this.word = w;
            this.hangmanService.startGame(w);
        });
    }

    onLetter(letter: string) {
        if (this.gameOver || this.usedLetters.includes(letter)) return;
        const correct = this.hangmanService.guess(letter);
        this.usedLetters.push(letter);
        this.keyClasses[letter] = correct ? 'correct' : 'absent';
        if (this.hangmanService.isGameOver()) {
            this.gameOver = true;
            this.finishGame();
        }
    }

    private finishGame() {
        this.gameFinishService.setFinishAction(() => {
            this.hangmanService.finishGame("AHORCADO");
        });
        if (this.authService.isPending()) {
            this.router.navigate(['/choose-game']);
        } else {
            this.router.navigate(['/finish-screen']);
        }
    }

    getImageByErrors(): string {
        this.errorsCounter = this.hangmanService.getErrors();
        switch (this.errorsCounter) {
            case 0: return 'assets/img0.jpg';
            case 1: return 'assets/img1.jpg';
            case 2: return 'assets/img2.jpg';
            case 3: return 'assets/img3.jpg';
            case 4: return 'assets/img4.jpg';
            case 5: return 'assets/img5.jpg';
            case 6: return 'assets/img6.jpg';
            default: return '';
        }
    }
}