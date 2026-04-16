import { Person } from "./person";

export interface Admin {
  personId?: number;
  department: 'GAME' | 'PAYMENT' | 'EVENT' | 'NOTIF';
  adminType: 'GAME_ADMIN' | 'PAYMENT_ADMIN' | 'EVENT_ADMIN' | 'NOTIF_ADMIN';
  permissions: JSON;
  person: Person;
}