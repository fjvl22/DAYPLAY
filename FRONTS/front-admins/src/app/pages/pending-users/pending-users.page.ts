import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { AdminService } from "src/app/core/services/admin.service";
import { UserPending } from "src/app/core/interfaces/user-pending";
import { UserPendingView } from "src/app/core/interfaces/user-pending-view";
import { loadStripe, Stripe, StripeCardElement } from "@stripe/stripe-js";
import { ApproveResponse } from "src/app/core/interfaces/approve-response";
import { AuthService } from "src/app/core/services/auth.service";
import { Admin } from "src/app/core/interfaces/admin";

@Component({
  selector: 'app-pending-users',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './pending-users.page.html'
})
export class PendingUsersPage {

  pending: UserPendingView[] = [];

  planFromStorage: string = '';

  stripe!: Stripe | null;
  card!: StripeCardElement;

  approveResponse!: ApproveResponse;

  publicKey = 'pk_test_51T1U1N5GIdWBJ34q2OC5aGbwbDumo6BVqM25lVCoUXsuvI4jbJ4FRfbI7FH6f5dFsdBJlJVT1vUoFWRF8Dge0zxs00Zl0324Q2';

  constructor(private auth: AuthService, private admin: AdminService) {
    this.load();
    this.initStripe();
  }

  async initStripe() {
    this.stripe = await loadStripe(this.publicKey);
  }

  load() {
    this.admin.getPendingUsers().subscribe((res: UserPending[]) => {

      this.planFromStorage = localStorage.getItem('planType') || '';

      this.pending = res.map(user => ({
        ...user,
        planType: this.planFromStorage
      }));
    });
  }

  approve(id: number, plan: string) {

    let nickname: string;

    this.auth.nickname$.subscribe(value => { nickname = value; });

    let admins: Admin[];

    let adminId!: number;

    this.admin.getAdmins().subscribe({

      next: (data: Admin[]) => {

        admins = data;

        admins.forEach((admin) => {

          if (admin.person.nickname === nickname) {

            if (admin.personId) {

              adminId = admin.personId;

              this.admin.approvePendingUser({ adminId, id, plan }).subscribe(async (res: ApproveResponse) => {

                this.approveResponse.clientSecret = res.clientSecret;
                this.approveResponse.paymentId = res.paymentId;

                const elements = this.stripe!.elements();

                this.card = elements.create('card');

                this.card.mount('#card-element');
              });
            }
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener admins: ', err);
      }
    });
  }

  async confirmPayment() {

    const result = await this.stripe!.confirmCardPayment(this.approveResponse.clientSecret, {payment_method: {card: this.card}});

    if (result.error) {
      console.error('Error en el pago: ', result.error.message);
      return;
    }

    console.log('Pago completado correctamente');

    this.load();
  }

  reject(id: number) {
    this.admin.rejectPendingUser(id).subscribe({
      next: () => {
        console.log('Usuario rechazado correctamente');
        this.load();
      },
      error: (err) => {console.error('Error rechazando usuario: ', err.message);}
    });
  }
}