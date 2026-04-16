export interface Payment {
    id: number;
    userId: number;
    amount: number;
    date: string;
    paymentMethod: string;
    transactionId?: string;
  }