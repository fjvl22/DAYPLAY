import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-numerickeyboard',
  standalone: true,
  imports: [],
  templateUrl: './numerickeyboard.component.html',
  styleUrl: './numerickeyboard.component.css'
})
export class NumerickeyboardComponent {
  @Input() disableActions = false;
  @Output() numberPressed = new EventEmitter<number>();
  @Output() deletePressed = new EventEmitter<void>();
  @Output() enterPressed = new EventEmitter<void>();
  pressNumber(num: number){
    this.numberPressed.emit(num);
  }
  pressDelete(){
    if(!this.disableActions) this.deletePressed.emit();
  }
  pressEnter(){
    if(!this.disableActions) this.enterPressed.emit();
  }
}
