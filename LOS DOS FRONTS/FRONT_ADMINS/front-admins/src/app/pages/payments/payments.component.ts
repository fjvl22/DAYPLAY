import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';
import { Payment } from '../../core/interfaces/payment';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {
  payments: Payment[] = [];
  constructor(private admin: AdminService) {
    this.admin.getPayments().subscribe((res: Payment[]) => {this.payments = res});
  }
}
