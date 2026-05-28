import { Observable } from "rxjs";
import { Notification } from "../interfaces/notification";
import { PaymentTrace } from "../interfaces/payment-trace";
import { Payment } from "../interfaces/payment";
import { SystemEvent } from "../interfaces/system-event";
import { DailyGameReward } from "../interfaces/daily-game-reward";
import { MathOperation } from "../interfaces/math-operation";
import { GameWord } from "../interfaces/game-word";
import { UserPending } from "../interfaces/user-pending";
import { AppUser } from "../interfaces/app-user";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:3000/api/admin';

  constructor(private http: HttpClient) {}

  // ===================== USERS =====================

  getUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.apiUrl}/users`);
  }

  getPendingUsers(): Observable<UserPending[]> {
    return this.http.get<UserPending[]>(`${this.apiUrl}/users/pending`);
  }

  approvePendingUser(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/approve`, body);
  }

  rejectPendingUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/reject/${id}`);
  }

  updateUser(id: number, body: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, body);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  // ===================== GAMES =====================

  getGames(): Observable<any> {
    return this.http.get(`${this.apiUrl}/games`);
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

  insertGameWord(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/games/word`, body);
  }

  insertMathOperation(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/games/operation`, body);
  }

  // ===================== REWARDS =====================

  getRewards(): Observable<DailyGameReward[]> {
    return this.http.get<DailyGameReward[]>(`${this.apiUrl}/rewards`);
  }

  approveReward(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/rewards/${userId}/approve`, {});
  }

  rejectReward(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/rewards/${userId}/reject`, {});
  }

  // ===================== EVENTS =====================

  getEvents(filters?: any): Observable<SystemEvent[]> {
    return this.http.get<SystemEvent[]>(`${this.apiUrl}/events`, {
      params: filters
    });
  }

  // ===================== ADMINS / PERMISSIONS =====================

  getAdmins(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admins`);
  }

  getPermissionsByDepartment(department: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/permissions/${department}`);
  }

  // ===================== PAYMENTS =====================

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments`);
  }

  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/payments/${id}`);
  }

  getPaymentTraces(id: number): Observable<PaymentTrace[]> {
    return this.http.get<PaymentTrace[]>(`${this.apiUrl}/payments/${id}/traces`);
  }

  // ===================== NOTIFICATIONS =====================

  sendNotificationToUser(body: Notification): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/user`, body);
  }

  sendNotificationToAll(body: Notification): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/all`, body);
  }
}