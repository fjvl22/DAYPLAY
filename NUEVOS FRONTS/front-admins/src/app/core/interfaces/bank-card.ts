export interface BankCard {
  id?: number;
  token: string;
  last4: string;
  brand?: string;
  bin?: string;
  expiryMonth?: number;
  expiryYear?: number;
  approxBalance?: number;
  isActive: boolean;
  bankEntityId?: number;
  userId: number;
  creationDate: string;
}