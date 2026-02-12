import { Component } from '@angular/core';
import { Requests } from '../services/requests';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activate-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activate-plan.component.html',
  styleUrl: './activate-plan.component.css'
})
export class ActivatePlanComponent {
  planType: string = '';
  constructor(private requests: Requests){}
  activate(){
    this.requests.activatePlan(this.planType).subscribe({
      next: (res: any) => {
        alert('Plan activado. Serás redirigido al pago.');
        window.location.href = res.checkoutUrl;
      },
      error: (err) => alert('Error al activar plan: '+err.message),
    });
  }
}
