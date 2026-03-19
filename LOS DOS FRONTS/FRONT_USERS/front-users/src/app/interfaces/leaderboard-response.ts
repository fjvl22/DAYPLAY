import { Leaderboard } from "./leaderboard";

export interface LeaderboardResponse {
    type: 'BASIC' | 'PREMIUM';
    data: Leaderboard[];
}