import { Component, OnInit, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule, ModalController } from "@ionic/angular";
import { AdminService } from "src/app/core/services/admin.service";
import { Payment } from "src/app/core/interfaces/payment";
import { TraceDetailModalComponent } from "../trace-detail.modal/trace-detail.modal.component";

@Component({
  selector: 'app-payment-detail-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './payment-detail.modal.component.html'
})
export class PaymentDetailModalComponent implements OnInit {

  @Input() paymentId!: number;

  payment?: Payment;
  loading = false;

  constructor(private adminService: AdminService, private modalCtrl: ModalController) {}

  ngOnInit(): void {
    this.loadPayment();
  }

  loadPayment(): void {

    this.loading = true;

    this.adminService.getPaymentById(this.paymentId).subscribe({
      next: (res) => {
        this.payment = res;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  async openTraces() {

    const modal = await this.modalCtrl.create({
      component: TraceDetailModalComponent,
      componentProps: { paymentId: this.paymentId }
    });

    await modal.present();
  }

  close() {
    this.modalCtrl.dismiss();
  }
}