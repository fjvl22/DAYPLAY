import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-game',
  standalone: true,
  imports: [],
  templateUrl: './choose-game.component.html',
  styleUrl: './choose-game.component.css'
})
export class ChooseGameComponent {
  constructor(private router: Router){}
  action(path: string){
    this.router.navigate([path]);
  }
  goToRanking(){this.router.navigate(['/ranking']);}
}
