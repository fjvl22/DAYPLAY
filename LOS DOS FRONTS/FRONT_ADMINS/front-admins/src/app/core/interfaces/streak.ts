export interface Streak {
  id?: number;
  userId: number;
  gameId: number;
  currentStreak: number;
  lastDate: string;
  updatedAt: string;
}