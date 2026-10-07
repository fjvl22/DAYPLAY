import { Component } from "@angular/core";
import { IonContent, IonIcon } from "@ionic/angular";
import { addIcons } from "ionicons";
import { arrowBackOutline, arrowForwardOutline } from "ionicons/icons";

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [ IonContent, IonIcon ],
  templateUrl: './story.page.html',
  styleUrl: './story.page.scss'
})
export class StoryPage {

  title: string = '';

  content: string = '';

  imageUrl: string = '';

  constructor() { addIcons({ arrowBackOutline, arrowForwardOutline }); }

  previous(): void {}

  next(): void {}
}