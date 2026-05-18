export interface UserPlan {
  id?: number;
  planType: 'BASIC' | 'PREMIUM';
  price: number;
  active: boolean;
}