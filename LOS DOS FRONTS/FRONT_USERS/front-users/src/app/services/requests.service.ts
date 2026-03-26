import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LeaderboardResponse } from "../interfaces/leaderboard-response";
import { Game } from "../interfaces/game";
import { MathOperation } from "../interfaces/math-operation";
import { GameWord } from "../interfaces/game-word";
import { MessageResponse } from "../interfaces/message-response";
import { MatchResponse } from "../interfaces/match-response";
import { StreakResponse } from "../interfaces/streak-response";
import { Chapter } from "../interfaces/chapter";
import { AppUser } from "../interfaces/app-user";

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private API_URL = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getLeaderboard(gameId: number, sortBy: string): Observable<LeaderboardResponse> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams().set('sortBy', sortBy);
    return this.http.get<LeaderboardResponse>(
      `${this.API_URL}/leaderboard/${gameId}`,
      { headers, params }
    );
  }

  updateLeaderboard(gameId: number, score: number): Observable<MessageResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<MessageResponse>(
      `${this.API_URL}/leaderboard`,
      { gameId, score },
      { headers }
    );
  }

  createMatch(gameId: number): Observable<MatchResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<MatchResponse>(
      `${this.API_URL}/match`,
      { gameId },
      { headers }
    );
  }

  finishMatch(matchId: number, score: number, extraData: object): Observable<MessageResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<MessageResponse>(
      `${this.API_URL}/match/finish`,
      { matchId, score, extraData },
      { headers }
    );
  }

  updateStreak(gameId: number): Observable<StreakResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<StreakResponse>(
      `${this.API_URL}/streak`,
      { gameId },
      { headers }
    );
  }

  getGames(): Observable<Game[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Game[]>(
      `${this.API_URL}/games`,
      { headers }
    );
  }

  getHangmanWords(): Observable<GameWord[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<GameWord[]>(
      `${this.API_URL}/hangman/words`,
      { headers }
    );
  }

  getWordleWords(): Observable<GameWord[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<GameWord[]>(
      `${this.API_URL}/wordle/words`,
      { headers }
    );
  }

  getMathOperations(page: number = 1): Observable<MathOperation[]>{
    const headers = this.getAuthHeaders();
    return this.http.get<MathOperation[]>(
      `${this.API_URL}/operations?page=${page}`,
      { headers }
    );
  }

  getAvailableChapters(): Observable<Chapter[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Chapter[]>(
      `${this.API_URL}/chapters`,
      { headers }
    );
  }

  getUsers(): Observable<AppUser[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<AppUser[]>(
      `${this.API_URL}/users`,
      { headers }
    );
  }
}