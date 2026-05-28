export interface Payment {
  id: number;
  userId: number;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  date: string;
  paymentMethod: string;
  transactionId?: string;
  appUser?: {
    id: number;
    person?: {
      nickname: string;
      email: string;
    };
  };
}