import { Service, signal } from '@angular/core';

export type LetterStatus = 'CORRECT' | 'PRESENT' | 'ABSENT';

@Service()
export class Wordle {
    private readonly MAX_ATTEMPTS = 6;
    private readonly WORD_LENGTH = 5;
    private readonly _secretWord = signal<string>('');
    private readonly _currentGuess = signal<string>('');
    private readonly _guesses = signal<string[]>([]);
    private readonly _results = signal<LetterStatus[][]>([]);
    private readonly _currentRow = signal<number>(0);
    private readonly _gameFinished = signal<boolean>(false);
    private readonly _gameWon = signal<boolean>(false);
    private readonly _keyboardStatus = signal<Map<string, LetterStatus>>(new Map());
    readonly secretWord = this._secretWord.asReadonly();
    readonly currentGuess = this._currentGuess.asReadonly();
    readonly guesses = this._guesses.asReadonly();
    readonly results = this._results.asReadonly();
    readonly currentRow = this._currentRow.asReadonly();
    readonly gameFinished = this._gameFinished.asReadonly();
    readonly gameWon = this._gameWon.asReadonly();
    readonly keyboardStatus = this._keyboardStatus.asReadonly();
    startGame(secretWord: string): void {
        this._secretWord.set(secretWord.toUpperCase());
        this._currentGuess.set('');
        this._guesses.set([]);
        this._results.set([]);
        this._currentRow.set(0);
        this._gameFinished.set(false);
        this._gameWon.set(false);
        this._keyboardStatus.set(new Map());
    }
    addLetter(letter: string): void {
        if (this._gameFinished()) return;
        const currentGuess = this._currentGuess();
        if (currentGuess.length>=this.WORD_LENGTH) return;
        this._currentGuess.set(currentGuess+letter.toUpperCase());
    }
    removeLetter(): void {
        if (this._gameFinished()) return;
        const currentGuess = this._currentGuess();
        if (currentGuess.length === 0) return;
        this._currentGuess.set(currentGuess.slice(0, -1));
    }
    submitGuess(): boolean {
        if (this._gameFinished()) return false;
        const guess = this._currentGuess();
        if (guess.length !== this.WORD_LENGTH) return false;
        if (!this.isValidWord(guess)) return false;
        const result = this.checkGuess(guess);
        this._guesses.update(guesses => [...guesses, guess]);
        this._results.update(results => [...results, result]);
        this.updateKeyboard(guess, result);
        this._currentGuess.set('');
        this._currentRow.update(row => row+1);
        if (this.hasWon(result)) {
            this._gameWon.set(true);
            this._gameFinished.set(true);
            return true;
        }
        if (this.hasLost()) {
            this._gameFinished.set(true);
            return true;
        }
        return true;
    }
    isValidWord(word: string): boolean { return word.length === this.WORD_LENGTH; }
    checkGuess(guess: string): LetterStatus[] {
        const secretWord = this._secretWord();
        const result: LetterStatus[] = Array(this.WORD_LENGTH).fill('ABSENT');
        const remainingLetters = secretWord.split('');
        for (let a = 0; a < this.WORD_LENGTH; a++) {
            if (guess[a] === secretWord[a]) {
                result[a] = 'CORRECT';
                remainingLetters[a] = '';
            }
        }
        for (let a = 0; a < this.WORD_LENGTH; a++) {
            if (result[a] === 'CORRECT') continue;
            const letterIndex = remainingLetters.indexOf(guess[a]);
            if (letterIndex !== -1) {
                result[a] = 'PRESENT';
                remainingLetters[letterIndex] = '';
            }
        }
        return result;
    }
    updateKeyboard(guess: string, result: LetterStatus[]): void {
        const keyboard = new Map(this._keyboardStatus());
        for (let a = 0; a < guess.length; a++) {
            const letter = guess[a];
            const newStatus = result[a];
            const currentStatus = keyboard.get(letter);
            if (currentStatus === undefined || this.getStatusPriority(newStatus) > this.getStatusPriority(currentStatus)) keyboard.set(letter, newStatus);
        }
        this._keyboardStatus.set(keyboard);
    }
    private getStatusPriority(status: LetterStatus): number {
        switch (status) {
            case 'ABSENT':
                return 1;
            case 'PRESENT':
                return 2;
            case 'CORRECT':
                return 3;
        }
    }
    hasWon(result: LetterStatus[]): boolean { return result.every(status => status === 'CORRECT'); }
    hasLost(): boolean { return (this._guesses().length >= this.MAX_ATTEMPTS && !this._gameWon()); }
    getLetterStatus(letter: string): LetterStatus | null { return this._keyboardStatus().get(letter.toUpperCase()) ?? null; }
    resetGame(): void {
        this._secretWord.set('');
        this._currentGuess.set('');
        this._guesses.set([]);
        this._results.set([]);
        this._currentRow.set(0);
        this._gameFinished.set(false);
        this._gameWon.set(false);
        this._keyboardStatus.set(new Map());
    }
}
