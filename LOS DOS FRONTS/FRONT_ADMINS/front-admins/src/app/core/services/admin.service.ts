import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppUser } from '../interfaces/app-user';
import { UserPending } from '../interfaces/user-pending';
import { Game } from '../interfaces/game';
import { GameWord } from '../interfaces/game-word';
import { MathOperation } from '../interfaces/math-operation';
import { DailyGameReward } from '../interfaces/daily-game-reward';
import { Payment } from '../interfaces/payment';
import { Notification } from '../interfaces/notification';
import { SystemEvent } from '../interfaces/system-event';
import { Admin } from '../interfaces/admin';
import { AuthService } from './auth.service';
import { PaymentDetailResponse } from '../interfaces/payment-detail-response';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private authService = inject(AuthService);

  private http = inject(HttpClient);

  private apiUrl = '/admin';

  // ================= USERS =================

  getUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.apiUrl}/users`);
  }

  getPendingUsers(): Observable<UserPending[]> {
    return this.http.get<UserPending[]>(`${this.apiUrl}/users/pending`);
  }

  approveUserPending(UserPendingId: number, plan: string): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.apiUrl}/users/approve`, {
      UserPendingId,
      plan
    });
  }

  rejectUserPending(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/users/reject/${id}`
    );
  }

  updateUser(id: number, user: Partial<AppUser>): Observable<AppUser> {
    return this.http.put<AppUser>(`${this.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/users/${id}`
    );
  }

  // ================= GAMES =================

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/games`);
  }

  getHangmanWords(): Observable<GameWord[]> {
    return this.http.get<GameWord[]>(`${this.apiUrl}/games/hangman`);
  }

  getWordleWords(): Observable<GameWord[]> {
    return this.http.get<GameWord[]>(`${this.apiUrl}/games/wordle`);
  }

  getMathOperations(): Observable<MathOperation[]> {
    return this.http.get<MathOperation[]>(`${this.apiUrl}/games/math`);
  }

  insertGameWord(word: GameWord): Observable<GameWord> {
    return this.http.post<GameWord>(
      `${this.apiUrl}/games/word`,
      word
    );
  }

  insertMathOperation(operation: MathOperation): Observable<MathOperation> {
    return this.http.post<MathOperation>(
      `${this.apiUrl}/games/math`,
      operation
    );
  }

  canUserPlayToday(userId: number, gameId: number): Observable<{ canPlay: boolean }> {

    const params = new HttpParams()
      .set('userId', userId)
      .set('gameId', gameId);

    return this.http.get<{ canPlay: boolean }>(
      `${this.apiUrl}/games/canPlay`,
      { params }
    );
  }

  // ================= REWARDS =================

  getDailyRewardRequests(): Observable<DailyGameReward[]> {
    return this.http.get<DailyGameReward[]>(`${this.apiUrl}/rewards`);
  }

  approveDailyReward(userId: number, ipAddress?: string):
    Observable<{ approved: boolean; message?: string }> {

    return this.http.post<{ approved: boolean; message?: string }>(
      `${this.apiUrl}/rewards/approve`,
      { userId, ipAddress }
    );
  }

  rejectDailyReward(rewardId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/rewards/${rewardId}`
    );
  }

  // ================= PAYMENTS =================

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments`);
  }

  getPaymentDetail(id: number): Observable<PaymentDetailResponse> {
    return this.http.get<PaymentDetailResponse>(`${this.apiUrl}/payments/${id}`);
  }

  // ================= NOTIFICATIONS =================

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications`);
  }

  createNotification(data: any) {
    return this.http.post(`${this.apiUrl}/notification`, data, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  createNotifications(data: any) {
    return this.http.post(`${this.apiUrl}/notifications`, data, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  // ================= EVENTS =================

  getEvents(): Observable<SystemEvent[]> {
    return this.http.get<SystemEvent[]>(`${this.apiUrl}/events`);
  }

  // ================= ADMINS =================

  getAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.apiUrl}/admins`);
  }

}