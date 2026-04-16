export interface GameWord {
  id?: number;
  gameId: number;
  word: string;
  language: string; // 'ES', 'EN', etc.
  active: boolean;
  creationDate: string;
}