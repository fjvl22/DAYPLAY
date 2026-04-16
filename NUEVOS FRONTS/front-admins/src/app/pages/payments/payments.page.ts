import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { AdminService } from "src/app/core/services/admin.service";
import { Payment } from "src/app/core/interfaces/payment";

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './payments.page.html'
})
export class PaymentsPage {

  payments: Payment[] = [];

  constructor(private admin: AdminService) {this.admin.getPayments().subscribe(res => this.payments = res);}
}