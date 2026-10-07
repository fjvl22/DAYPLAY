import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.page.html',
  styleUrls: ['./admin-register.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AdminRegisterPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
