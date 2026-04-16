export interface Person {
  id?: number;
  nickname: string;
  passwordHash: string;
  email: string;
  registrationDate: Date
  active: boolean;
  personType: 'USER' | 'ADMIN';
}