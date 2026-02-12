import { Component, OnInit } from '@angular/core';
import { MathOperation } from '../math-operation';
import { MathrushService } from '../services/mathrush.service';

@Component({
  selector: 'app-mathrush',
  standalone: true,
  imports: [],
  templateUrl: './mathrush.component.html',
  styleUrl: './mathrush.component.css'
})
export class MathrushComponent implements OnInit {
  currentOperation: MathOperation | null = null;
  punctuation: number = 0;
  selectedOption: string | null = null;

  showEndMessage = false;
  finalScore = 0;
  constructor(private mathrushservice: MathrushService){}
  ngOnInit() {
    this.mathrushservice.start();this.mathrushservice.currentOperation$.subscribe(op=>{
      this.currentOperation = op;
      this.selectedOption = null;
    });
    this.mathrushservice.punctuation$.subscribe(score=>{
      this.punctuation = score;
    });
    this.mathrushservice.status$.subscribe(status=>{
      if(status==='finished'){
        this.finalScore = this.punctuation;
        this.showEndMessage = true;
        setTimeout(() => {
          this.showEndMessage = false;
          this.mathrushservice.start();
        }, 5000);
      }
    });
  }
  selectOption(option: string){
    if(!this.currentOperation||this.selectedOption) return;
    this.selectedOption = option;
    this.mathrushservice.answer(+option);
  }
}
