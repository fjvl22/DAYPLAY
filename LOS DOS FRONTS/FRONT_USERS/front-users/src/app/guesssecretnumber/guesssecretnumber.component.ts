import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NumerickeyboardComponent } from "../numerickeyboard/numerickeyboard.component";
import { GuesssecretnumberService } from "../services/guesssecretnumber.service";
import { take } from "rxjs";

@Component({
  selector: 'app-guesssecretnumber',
  standalone: true,
  imports: [CommonModule, NumerickeyboardComponent],
  templateUrl: './guesssecretnumber.component.html',
  styleUrl: './guesssecretnumber.component.css'
})
export class GuesssecretnumberComponent {
  private service = inject(GuesssecretnumberService);
  value = '';
  labelText = 'Introduce un valor';
  remainingAttempts = 3;
  status: 'playing' | 'won' | 'lost' = 'playing';
  gameOver = false;
  constructor(){
    this.service.remainingAttempts$.subscribe(n=>{
      this.remainingAttempts = n;
      this.checkGameOver();
    });
    this.service.status$.subscribe(s=>{
      this.status = s;
      this.checkGameOver();
    });
  }
  onInputChange(event: Event){
    if(this.gameOver) return;
    const input = event.target as HTMLInputElement;
    const filtered = input.value.replace(/\D/g, '');
    this.setValue(filtered);
  }
  addNumber(num: number){
    if(this.gameOver) return;
    this.setValue(this.value+num);
  }
  deleteNumber(){
    if(this.gameOver) return;
    this.value = this.value.slice(0, -1);
  }
  confirm(){
    if(this.gameOver || this.value==='') return;
    const numericValue = Number(this.value);
    const result = this.service.try(numericValue);
    if(result===0){
      this.updateLabel(`¡Correcto! Era ${numericValue}`);
    }else if(result===1){
      this.updateLabel(`Muy bajo. Intentos restantes: ${this.remainingAttempts}`);
    }else{
      this.updateLabel(`Muy alto. Intentos restantes: ${this.remainingAttempts}`);
    }
    this.value = '';
  }
  private setValue(candidate: string){
    if(candidate===''){
      this.value='';
      return;
    }
    const numericValue = Number(candidate);
    if(numericValue>100) return;
    this.value = candidate;
  }
  private updateLabel(text: string){
    this.labelText = text;
  }
  private checkGameOver(){
    this.gameOver = this.status!=='playing'||this.remainingAttempts<=0;
  }
}