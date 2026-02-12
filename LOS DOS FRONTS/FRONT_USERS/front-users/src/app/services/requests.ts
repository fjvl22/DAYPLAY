import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, LOCALE_ID } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Requests {
  private baseURL = 'http://localhost:3000';
  constructor(private http: HttpClient){}
  getProfile(): Observable<any>{
    return this.http.get(`${this.baseURL}/profile`);
  }
  addBankCard(formData: FormData): Observable<any>{
    return this.http.post(`${this.baseURL}/bank-card`, formData);
  }
  getPayments(): Observable<any>{
    return this.http.get(`${this.baseURL}/payments`);
  }
  getPlan(): Observable<any>{
    return this.http.get(`${this.baseURL}/plan`);
  }
  activatePlan(planType: string): Observable<any>{
    return this.http.post(`${this.baseURL}/activate-plan`, { planType });
  }
  login(nickname: string, password: string) {
    return this.http.post<{
      token: string;
      planType: string;
    }>(`${this.baseURL}/login`, { nickname, password })
    .pipe(
      tap(res => {
        localStorage.setItem('jwt_token', res.token);
        localStorage.setItem('planType', res.planType);
      })
    );
  }  
  deleteAccount(token: string): Observable<any>{
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.delete(`${this.baseURL}/api/deleteAccount`, { headers });
  }
  logout(): void{
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('nickname');
  }
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
  getNickname(): string | null {
    return localStorage.getItem('nickname');
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.baseURL}/change-password`, { currentPassword, newPassword });
  }
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseURL}/forgot-password`, { email });
  }
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseURL}/reset-password`, { token, newPassword });
  }
  getRankingByGame(gameId: number): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseURL}/leaderboards?gameId=${gameId}`);
  }
  getUserInfo() {
    return {
      nickname: localStorage.getItem('nickname'),
      role: localStorage.getItem('role'),
      planType: localStorage.getItem('planType')
    };
  }
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseURL}/userRegistration`, userData);
  }
}
