import { GameMatch } from "./game-match";
import { Streak } from "./streak";

export interface MatchResponse {
    message: string;
    streak: Streak;
    match: GameMatch;
}