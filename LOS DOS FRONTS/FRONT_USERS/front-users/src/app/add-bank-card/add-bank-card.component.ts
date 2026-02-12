import { Component } from '@angular/core';
import { Requests } from '../services/requests';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-bank-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-bank-card.component.html',
  styleUrl: './add-bank-card.component.css'
})
export class AddBankCardComponent {
  frontFile : File | null = null;
  backFile : File | null = null;
  constructor(private requests: Requests){}
  onFileChange(event: any, side: 'front' | 'back'){
    const file = event.target.files[0];
    if(side==='front') this.frontFile = file;
    else this.backFile = file;
  }
  submit(){
    if(!this.frontFile || !this.backFile){
      alert('Debes subir ambas imágenes de la tarjeta');
      return;
    }
    const formData = new FormData();
    formData.append('front', this.frontFile);
    formData.append('back', this.backFile);
    this.requests.addBankCard(formData).subscribe({
      next: () => alert('Tarjeta añadida correctamente'),
      error: (err) => alert('Error al añadir tarjeta: '+err.message),
    });
  }
}
