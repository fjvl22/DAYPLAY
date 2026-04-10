import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { LoginResponse } from "../interfaces/login-response";
import { MessageResponse } from "../interfaces/message-response";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../interfaces/jwt-payload";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = '/auth';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  register(nickname: string, password: string, email: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.API_URL}/register/user`, { nickname, password, email });
  }

  login(nickname: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, { nickname, password })
      .pipe(
        tap((res: LoginResponse) => {
          localStorage.setItem('token', res.token);
          const payload = jwtDecode<JwtPayload>(res.token);
          localStorage.setItem('userId', payload.id.toString());
          localStorage.setItem('role', payload.role);
          localStorage.setItem('status', payload.status);
          if (payload.nickname) {
            localStorage.setItem('nickname', payload.nickname);
          }
        })
      );
  }

  logout(): Observable<MessageResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<MessageResponse>(`${this.API_URL}/logout`, {}, { headers })
      .pipe(
        tap(() => this.clearSession())
      );
  }

  clearSession(): void {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try { return jwtDecode<JwtPayload>(token); } catch { return null; }
  }

  getUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? Number(id) : null;
  }

  getRole(): JwtPayload['role'] | null {
    return this.getUser()?.role ?? null;
  }

  getStatus(): JwtPayload['status'] | null {
    return this.getUser()?.status ?? null;
  }

  isPending(): boolean {
    return this.getStatus() === 'PENDING';
  }

  isActiveUser(): boolean {
    return this.getStatus() === 'ACTIVE';
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getNickname(): string | null {
    return this.getUser()?.nickname ?? null;
  }

  changePassword(currentPassword: string, newPassword: string): Observable<MessageResponse> {
    const headers = this.getAuthHeaders();
    return this.http.put<MessageResponse>(
      `${this.API_URL}/change-password`,
      { currentPassword, newPassword },
      { headers }
    );
  }

  getPlanTypes(): Observable<string[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<string[]>(`${this.API_URL}/plan-types`, { headers });
  }
}