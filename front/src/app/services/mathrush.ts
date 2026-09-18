import { Service, signal } from '@angular/core';

@Service()
export class Mathrush {
  private readonly TOTAL_QUESTIONS = 10;
  private readonly TOTAL_OPTIONS = 4;
  private readonly _questions = signal<MathOperation[]>([]);
  private readonly _currentQuestion = signal<number>(0);
  private readonly _results = signal<number[]>([]);
  private readonly _correctAnswers = signal<number>(0);
  private readonly _gameFinished = signal<boolean>(false);
  private readonly _gameStarted = signal<boolean>(false);
  readonly questions = this._questions.asReadonly();
  readonly currentQuestion = this._currentQuestion.asReadonly();
  readonly results = this._results.asReadonly();
  readonly correctAnswers = this._correctAnswers.asReadonly();
  readonly gameFinished = this._gameFinished.asReadonly();
  readonly gameStarted = this._gameStarted.asReadonly();
  startGame(questions: MathOperation[]): void {
    this._questions.set(questions);
    this._currentQuestion.set(0);
    this._results.set([]);
    this._correctAnswers.set(0);
    this._gameFinished.set(false);
    this._gameStarted.set(true);
  }
  selectAnswer(answer: number): boolean {
    if (this._gameFinished()) return false;
    const question = this.getCurrentQuestionData();
    if (question === null) return false;
    const correct = answer === question.result;
    this._results.update(results => [...results, { question, selectedAnswer: answer, correct }]);
    if (correct) this._correctAnswers.update(correctAnswers => correctAnswers+1);
    if (this._currentQuestion() === this.TOTAL_QUESTIONS-1) this._gameFinished.set(true);
    else this._currentQuestion.update(currentQuestion => currentQuestion+1);
    return correct;
  }
  getCurrentQuestionData(): MathOperation | null { return this._questions()[this._currentQuestion()]??null; }
  getCurrentQuestionNumber(): number { return this.TOTAL_QUESTIONS; }
  getTotalOptions(): number { return this.TOTAL_OPTIONS; }
  getScore(): number { return this._correctAnswers(); }
  getResults(): number[] { return this._results(); }
  resetGame(): void {
    this._questions.set([]);
    this._currentQuestion.set(0);
    this._results.set([]);
    this._correctAnswers.set(0);
    this._gameFinished.set(false);
    this._gameStarted.set(false);
  }
}
