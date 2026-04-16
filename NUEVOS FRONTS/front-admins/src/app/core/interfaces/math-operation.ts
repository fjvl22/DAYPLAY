import { MathOption } from "./math-option";

export interface MathOperation {
  id?: number;
  operation: string;
  result: string;
  gameId?: number;
  MathOptions: MathOption[];
}