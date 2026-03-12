export interface GameMatch {
    id: number;
    userId: number;
    gameId: number;
    date: string;
    score: number;
    extraData?: any;
  }