import { Component } from '@angular/core';

import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

import { LetterKeyboardComponent } from '../../components/letter-keyboard/letter-keyboard.component';

@Component({
  selector: 'app-hangman',
  templateUrl: './hangman.page.html',
  styleUrls: ['./hangman.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, LetterKeyboardComponent]
})
export class HangmanPage {

    

}
