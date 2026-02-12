import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Requests } from '../services/requests';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  payments: any[] = [];
  constructor(private requests: Requests){}
  ngOnInit(): void {
    this.requests.getPayments().subscribe({
      next: (res) => (this.payments = res),
      error: (err) => console.error(err),
    });
  }
}
