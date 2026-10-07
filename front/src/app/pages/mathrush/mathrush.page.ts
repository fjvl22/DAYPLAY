import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-mathrush',
  templateUrl: './mathrush.page.html',
  styleUrls: ['./mathrush.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MathrushPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
