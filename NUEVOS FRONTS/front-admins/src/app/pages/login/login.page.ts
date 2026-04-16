import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule, NavController } from "@ionic/angular";

import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {

  nickname = '';
  password = '';

  constructor(
    private auth: AuthService,
    private navCtrl: NavController
  ) {}

  login() {
    this.auth.login(this.nickname, this.password).subscribe(() => {
      this.navCtrl.navigateRoot('/users');
    });
  }
}