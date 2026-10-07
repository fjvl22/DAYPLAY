import { Component } from "@angular/core";

import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput } from "@ionic/angular";

import { FormsModule } from "@angular/forms";

import { NumericKeyboardComponent } from "../../components/numeric-keyboard/numeric-keyboard.component";

@Component({
  selector: 'app-guesssecretnumber',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonInput, FormsModule, NumericKeyboardComponent],
  templateUrl: './guesssecretnumber.page.html',
  styleUrl: './guesssecretnumber.page.scss'
})
export class GuesssecretnumberPage {

  value: string = '';

  message: string = '';

  onNumberPressed(number: number): void { this.value += number.toString(); }

  onDeletePressed(): void { this.value = this.value.slice(0, -1); }

  onEnterPressed(): void {
    // POR PROGRAMAR
  }
}