import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule, ModalController } from "@ionic/angular";
import { AdminService } from "src/app/core/services/admin.service";
import { Payment } from "src/app/core/interfaces/payment";
import { TraceDetailModalComponent } from "src/app/modals/trace-detail.modal/trace-detail.modal.component";

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './payments.page.html'
})
export class PaymentsPage {

  payments: Payment[] = [];

  constructor(private modalCtrl: ModalController, private admin: AdminService) {this.admin.getPayments().subscribe(res => this.payments = res);}

  async openTraceModal(id: number) {
    const modal = await this.modalCtrl.create({
      component: TraceDetailModalComponent,
      componentProps: {
        paymentId: id
      }
    });
    await modal.present();
  }
}