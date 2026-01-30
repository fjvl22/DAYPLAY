import { Component, EventEmitter, Output } from '@angular/core';
import { Cell } from '../cell';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Output() selectedCell = new EventEmitter<string>();
  cells: Cell[] = [
    { id: 1, src: '', path: '' },
    { id: 1, src: '', path: '' },
    { id: 1, src: '', path: '' },
    { id: 1, src: '', path: '' }
  ];
  onClick(cell: Cell){this.selectedCell.emit(cell.path);}
  getRows(): Cell[][]{
    const rows: Cell[][] = [];
    for(let a=0; a<this.cells.length; a+=2){
      rows.push(this.cells.slice(a, a+2));
    }
    return rows;
  }
}
