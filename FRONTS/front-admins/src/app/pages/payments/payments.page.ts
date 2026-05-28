import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule, ModalController } from "@ionic/angular";
import { AdminService } from "src/app/core/services/admin.service";
import { Payment } from "src/app/core/interfaces/payment";
import { PaymentDetailModalComponent } from "../../modals/payment-detail.modal/payment-detail.modal.component";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './payments.page.html'
})
export class PaymentsPage implements OnInit {

  payments: Payment[] = [];
  loading = false;

  constructor(private adminService: AdminService, private modalCtrl: ModalController) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;

    this.adminService.getPayments().subscribe({
      next: (res) => {
        this.payments = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  async openPayment(paymentId: number) {

    const modal = await this.modalCtrl.create({
      component: PaymentDetailModalComponent,
      componentProps: { paymentId }
    });

    await modal.present();
  }
}