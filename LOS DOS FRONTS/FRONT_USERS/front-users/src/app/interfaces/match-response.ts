import { GameMatch } from "./game-match";

export interface MatchResponse {
    message: string;
    match: GameMatch;
}