import { Person } from "./person";

export interface UserPending {
  personId?: number;
  person: Person;
}