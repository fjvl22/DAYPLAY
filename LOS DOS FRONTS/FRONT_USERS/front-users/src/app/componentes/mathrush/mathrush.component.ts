import { Component, OnInit } from "@angular/core";
import { MathRushService } from "../../services/math-rush.service";
import { MathOperation } from "../../interfaces/math-operation";
import { Router } from "@angular/router";
import { GameFinishService } from "../../services/game-finish.service";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-math-rush',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './mathrush.component.html',
    styleUrls: ['./mathrush.component.css']
})
export class MathRushComponent implements OnInit {
    currentOperation: MathOperation | null = null;
    options: number[] = [];
    selectedAnswer: number | null = null;
    showResult = false;
    answer!: number;

    constructor(public gameFinishService: GameFinishService, public mathRushService: MathRushService, private router: Router, private authService: AuthService) {}

    ngOnInit(): void {
        this.mathRushService.fetchDailyOperations().subscribe(ops => {
            this.mathRushService.startGame(ops);
            this.loadNextOperation();
        });
    }

    loadNextOperation() {
        this.currentOperation = this.mathRushService.getCurrentOperation();
        this.selectedAnswer = null;
        this.showResult = false;

        if (!this.currentOperation) return;

        const correct = Number(this.currentOperation.result);
        this.options = [correct];
        while (this.options.length < 4) {
            const fake = correct + Math.floor(Math.random()*21-10);
            if (!this.options.includes(fake)) this.options.push(fake);
        }
        this.options.sort(() => Math.random() - 0.5);
    }

    selectAnswer() {
        if (this.showResult || this.mathRushService.isFinished()) return;
        if (this.selectedAnswer === null) return;

        this.mathRushService.submitAnswer(this.selectedAnswer);
        this.showResult = true;

        setTimeout(() => {
            if (!this.mathRushService.isFinished()) {
                this.loadNextOperation();
            } else {
                this.finishGame();
            }
        }, 1000);
    }

    isCorrect(answer: number): boolean {
        return this.currentOperation ? Number(this.currentOperation?.result) === answer : false;
    }

    private finishGame() {
        this.gameFinishService.setFinishAction(() => {
            this.mathRushService.finishGame("MATH RUSH", this.answer);
        });
        if (this.authService.isPending()) {
            this.router.navigate(['/choose-game']);
        } else {
            this.router.navigate(['/finish-screen']);
        }
    }
}