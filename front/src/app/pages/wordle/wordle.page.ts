import { Component } from "@angular/core";

import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular";

import { LetterKeyboardComponent } from "../../components/letter-keyboard/letter-keyboard.component";

@Component({
  selector: 'app-wordle',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, LetterKeyboardComponent],
  templateUrl: 'wordle.page.html',
  styleUrl: 'wordle.page.scss'
})
export class WordlePage {

  board: string[][] = Array.from({ length: 6 }, () => Array(5).fill(''));

  onKeyPressed(key: string): void {
    // POR PROGRAMAR
  }

  onDeletePressed(): void {
    // POR PROGRAMAR
  }
}