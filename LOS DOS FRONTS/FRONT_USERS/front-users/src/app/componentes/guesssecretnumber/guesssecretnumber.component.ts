import { Component, HostListener, OnInit } from "@angular/core";
import { GuessSecretNumberService } from "../../services/guess-secret-number.service";

@Component({
  selector: 'app-guess-secret-number',
  templateUrl: './guess-secret-number.component.html',
  styleUrls: ['./guess-secret-number.component.css']
})
export class GuessSecretNumberComponent implements OnInit {
  currentInput: string = '';
  message: string = '';
  constructor(private service: GuessSecretNumberService) {}
  ngOnInit(): void {
    this.service.startGame();
  }
  handleKey(key: string) {
    if (this.service.isFinished()) return;
    if (key === 'C') {
      this.currentInput = '';
      return;
    }
    if (key >= '0' && key <= '9') {
      if (this.currentInput.length < 3) this.currentInput += key;
    }
  }
  sumbitGuess() {
    if (!this.currentInput || this.service.isFinished()) return;
    const result = this.service.guess(Number(this.currentInput));
    if (result === 'correct') this.message = "🎉 ¡Correcto!";
    if (result === 'gameover') this.message = `💀 Se acabaron los intentos. Número: ${this.service.getSecretNumber()}`;
    if (result === 'high') this.message = "📈 Demasiado alto";
    if (result === 'low') this.message = "📉 Demasiado bajo";
    this.currentInput = '';
  }
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.service.isFinished()) return;
    if (event.key >= '0' && event.key >= '9') this.handleKey(event.key);
    if (event.key === 'Enter') this.sumbitGuess();
    if (event.key === 'Backspace') this.currentInput = this.currentInput.slice(0, -1);
  }
}