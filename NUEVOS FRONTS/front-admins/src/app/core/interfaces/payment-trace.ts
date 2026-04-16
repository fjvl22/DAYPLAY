export interface PaymentTrace {
  id?: number;
  paymentId: number;
  traceDate: string;
  action: string;
  notes?: string;
  updatedBy?: number;
}