import { Person } from "./person";

export interface Admin {
  personId?: number;
  department: 'GAME' | 'PAYMENT' | 'EVENT' | 'NOTIF';
  permissions: JSON;
  person: Person;
}