import { Component, OnInit } from '@angular/core';
import { HangmanService } from '../../services/hangman.service';
import { Router } from '@angular/router';
import { RequestsService } from '../../services/requests.service';

@Component({
  selector: 'app-hangman',
  standalone: true,
  imports: [],
  templateUrl: './hangman.component.html',
  styleUrl: './hangman.component.css'
})
export class HangmanComponent implements OnInit {
  word: string = '';
  usedLetters: string[] = [];
  keyClasses: { [letter: string]: string } = {};

  constructor(private hangmanService: HangmanService, private requests: RequestsService, private router: Router) {}

  ngOnInit() {
    this.hangmanService.fetchWord().subscribe(w => {
      this.word = w;
      this.hangmanService.startGame(w);
    });
  }

  onLetter(letter: string) {
    if (this.usedLetters.includes(letter)) return;
    const correct = this.hangmanService.guess(letter);this.usedLetters.push(letter);
    this.keyClasses[letter] = correct ? 'correct' : 'absent';
  }

  save() {

  }

  return() {
    this.router.navigate(['/choose-game']);
  }
}
