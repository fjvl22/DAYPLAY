import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonInput, IonCheckbox, IonButton } from "@ionic/angular";

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [FormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonInput, IonCheckbox, IonButton]
})
export class LoginPage {

  

}
