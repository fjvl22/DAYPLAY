import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordleService } from '../services/wordle.service';
import { SpanishKeyboardComponent } from '../spanish-keyboard/spanish-keyboard.component';

@Component({
  selector: 'app-wordle',
  standalone: true,
  imports: [CommonModule, SpanishKeyboardComponent],
  templateUrl: './wordle.component.html',
  styleUrl: './wordle.component.css'
})
export class WordleComponent implements OnInit {
  grid: string[][] = Array.from({ length: 6 }, () => Array(5).fill(''));
  colors: number[][] = [];
  letterStates: Record<string, number> = {};
  currentRow = 0;
  curentCol = 0;
  status: 'playing' | 'won' | 'lost' = 'playing';
  constructor(private wordleService: WordleService){}
  ngOnInit() {
    this.wordleService.start('CASAS');
    this.wordleService.results$.subscribe(results=>{
      this.colors = results;
      this.updateKeyboardColors();
    });
    this.wordleService.status$.subscribe(status=>{
      this.status = status;
    });
  }
  onKeyPress(key: string){
    if(this.status!=='playing') return;
    if(key==='BACKSPACE'){
      if(this.curentCol>0){
        this.curentCol--;
        this.grid[this.currentRow][this.curentCol] = '';
      }
      return;
    }
    if(this.curentCol>=5) return;
    this.grid[this.currentRow][this.curentCol] = key;
    this.curentCol++;
  }
  submitWord(){
    if(this.curentCol<5||this.status!=='playing') return;
    const word = this.grid[this.currentRow].join('');
    this.wordleService.try(word);
    this.currentRow++;
    this.curentCol = 0;
  }
  updateKeyboardColors(){
    this.colors.forEach((row, r)=>{
      row.forEach((value, c)=>{
        const letter = this.grid[r][c];
        const current = this.letterStates[letter];
        if(current===2) return;
        if(current===1&&value===0) return;
        this.letterStates[letter] = value;
      });
    });
  }
  getCellClass(row: number, col: number): string{
    const value = this.colors[row]?.[col];
    if(value===2) return 'correct';
    if(value===1) return 'present';
    if(value===0) return 'absent';
    return '';
  }
  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent){
    if(event.key==='Backspace') this.onKeyPress('BACKSPACE');
    if(event.key==='Enter') this.submitWord();
    if(/^[a-zA-ZñÑ]$/.test(event.key)){
      this.onKeyPress(event.key.toUpperCase());
    }
  }
}
