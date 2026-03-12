import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Leaderboard } from '../interfaces/leaderboard';
import { Game } from '../interfaces/game';
import { MathOperation } from '../interfaces/math-operation';
import { GameWord } from '../interfaces/game-word';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private API_URL = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) {}

  getLeaderboard(gameId: number, sortBy: string): Observable<Leaderboard[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const params = new HttpParams().set('sortBy', sortBy);
    return this.http.get<Leaderboard[]>(`${this.API_URL}/leaderboard/${gameId}`, { headers, params });
  }

  getGames(): Observable<Game[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Game[]>(this.API_URL+"/games", { headers });
  }

  getHangmanWord(): Observable<GameWord[]> {
    return this.http.get<GameWord[]>(`${this.API_URL}/hangman`);
  }

  getWordleWord(): Observable<GameWord[]> {
    return this.http.get<GameWord[]>(`${this.API_URL}/wordle`);
  }

  getMathOperations(page: number = 1): Observable<MathOperation[]> {
    return this.http.get<MathOperation[]>(`${this.API_URL}/mathrush?page=${page}`);
  }
}
