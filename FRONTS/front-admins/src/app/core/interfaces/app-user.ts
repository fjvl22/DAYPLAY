import { Person } from "./person";

export interface AppUser {
  personId?: number;
  subscriptionDate: string;
  planId?: number;
  person: Person;
}