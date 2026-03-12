import { Component, OnInit } from "@angular/core";
import { MathRushService } from "../../services/math-rush.service";
import { MathOperation } from "../../interfaces/math-operation";

@Component({
  selector: 'app-math-rush',
  templateUrl: './math-rush.component.html',
  styleUrls: ['./math-rush.component.css']
})
export class MathRushComponent implements OnInit {
  currentOperation: MathOperation | null = null;
  options: number[] = [];
  selectedAnswer: number | null = null;
  showResult = false;
  constructor(private mathRushService: MathRushService) {}
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
    while (this.options.length<4) {
      const fake = correct + Math.floor(Math.random()*20-10);
      if (!this.options.includes(fake)) {
        this.options.push(fake);
      }
    }
    this.options.sort(()=>Math.random()-0.5);
  }
  selectAnswer(answer: number) {
    if (this.showResult || this.mathRushService.isFinished()) return;
    this.selectedAnswer = answer;
    this.mathRushService.submitAnswer(answer);
    this.showResult = true;
    setTimeout(() => {
      if (!this.mathRushService.isFinished()) {
        this.loadNextOperation();
      }
    }, 1000);
  }
  isCorrect(answer: number): boolean {
    return this.currentOperation ? Number(this.currentOperation.result) === answer : false;
  }
}