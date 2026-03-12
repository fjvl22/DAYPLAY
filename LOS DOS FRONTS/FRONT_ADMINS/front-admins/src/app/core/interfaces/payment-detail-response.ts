import { Payment } from "./payment";
import { PaymentTrace } from "./payment-trace";

export interface PaymentDetailResponse {
    payment: Payment;
    traces: PaymentTrace[];
  }