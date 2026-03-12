import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserPending } from '../interfaces/user-pending';
import { Game } from '../interfaces/game';
import { DailyGameReward } from '../interfaces/daily-game-reward';
import { Payment } from '../interfaces/payment';
import { SystemEvent } from '../interfaces/system-event';
import { Notification } from '../interfaces/notification';
import { AppUser } from '../interfaces/app-user';
import { PaymentDetailResponse } from '../interfaces/payment-detail-response';
import { Admin } from '../interfaces/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private api = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) {}

  // =============================
  // USERS
  // =============================

  getUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.api}/users`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/users/${id}`);
  }

  getPendingUsers(): Observable<UserPending[]> {
    return this.http.get<UserPending[]>(`${this.api}/users/pending`);
  }

  approvePendingUser(id: number): Observable<void> {
    return this.http.post<void>(`${this.api}/users/pending/${id}/approve`, {});
  }

  rejectPendingUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/users/pending/${id}`);
  }

  // =============================
  // GAMES
  // =============================

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.api}/games`);
  }

  createGame(data: Game): Observable<Game> {
    return this.http.post<Game>(`${this.api}/games`, data);
  }

  deleteGame(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/games/${id}`);
  }

  // =============================
  // DAILY REWARDS
  // =============================

  getDailyRewards(): Observable<DailyGameReward[]> {
    return this.http.get<DailyGameReward[]>(`${this.api}/daily-rewards`);
  }

  approveDailyReward(id: number): Observable<void> {
    return this.http.post<void>(`${this.api}/daily-rewards/${id}/approve`, {});
  }

  rejectDailyReward(id: number): Observable<void> {
    return this.http.post<void>(`${this.api}/daily-rewards/${id}/reject`, {});
  }

  // =============================
  // PAYMENTS
  // =============================

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.api}/payments`);
  }

  getPaymentDetail(paymentId: number): Observable<PaymentDetailResponse> {
    return this.http.get<PaymentDetailResponse>(`${this.api}/payments/${paymentId}`);
  }

  // =============================
  // NOTIFICATIONS
  // =============================

  createNotification(data: Notification): Observable<Notification> {
    return this.http.post<Notification>(`${this.api}/notifications`, data);
  }

  // =============================
  // EVENTS
  // =============================

  getEvents(): Observable<SystemEvent[]> {
    return this.http.get<SystemEvent[]>(`${this.api}/events`);
  }

  // =============================
  // ADMINS
  // =============================

  getAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.api}/admins`);
  }

}