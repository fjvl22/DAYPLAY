import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders
} from "@angular/common/http";

import {
  BehaviorSubject,
  Observable,
  tap
} from "rxjs";

import { jwtDecode } from "jwt-decode";

import { environment } from "src/environments/environment";

import { LoginResponse } from "../interfaces/login-response";
import { MessageResponse } from "../interfaces/message-response";
import { JwtPayload } from "../interfaces/jwt-payload";
import { LoginPayload } from "../interfaces/login-payload";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = `${environment.apiUrl}/auth`;

  private nicknameSubject = new BehaviorSubject<string>('User');
  nickname$ = this.nicknameSubject.asObservable();

  private roleSubject = new BehaviorSubject<JwtPayload['role'] | null>(null);
  role$ = this.roleSubject.asObservable();

  private statusSubject = new BehaviorSubject<JwtPayload['status'] | null>(null);
  status$ = this.statusSubject.asObservable();

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  register(
    nickname: string,
    password: string,
    email: string
  ): Observable<MessageResponse> {

    return this.http.post<MessageResponse>(
      `${this.API_URL}/register/user`,
      {
        nickname,
        password,
        email
      }
    );
  }

  login(
    payload: LoginPayload
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.API_URL}/login`, payload
    ).pipe(
      tap((res) => {

        sessionStorage.setItem(
          'accessToken',
          res.accessToken
        );

        if (payload.rememberMe) {
          localStorage.setItem(
            'refreshToken',
            res.refreshToken
          );
        } else {
          sessionStorage.setItem(
            'refreshToken',
            res.refreshToken
          );
        }

        this.syncFromToken();
      })
    );
  }

  logout(): Observable<MessageResponse> {

    return this.http.post<MessageResponse>(
      `${this.API_URL}/logout`,
      {},
      {
        headers: this.getAuthHeaders()
      }
    ).pipe(
      tap(() => this.clearSession())
    );
  }

  refreshToken(): Observable<any> {

    return this.http.post(
      `${this.API_URL}/refresh`,
      {
        refreshToken: this.getRefreshToken()
      }
    ).pipe(
      tap((res: any) => {

        sessionStorage.setItem(
          'accessToken',
          res.accessToken
        );

        this.syncFromToken();
      })
    );
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<MessageResponse> {

    return this.http.put<MessageResponse>(
      `${this.API_URL}/change-password`,
      {
        currentPassword,
        newPassword
      },
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  deleteAccount(password: string): Observable<MessageResponse> {

    return this.http.request<MessageResponse>(
      'delete',
      `${this.API_URL}/delete-account`,
      {
        body: { password },
        headers: this.getAuthHeaders()
      }
    );
  }

  getPlanTypes(): Observable<string[]> {

    return this.http.get<string[]>(
      `${this.API_URL}/plan-types`,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  getAccessToken(): string | null {

    const token = sessionStorage.getItem('accessToken');

    return token && token !== 'undefined'
      ? token
      : null;
  }

  getRefreshToken(): string | null {

    return (
      localStorage.getItem('refreshToken') ||
      sessionStorage.getItem('refreshToken')
    );
  }

  private decodeToken(): JwtPayload | null {

    const token = this.getAccessToken();

    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  private syncFromToken(): void {

    const payload = this.decodeToken();

    this.nicknameSubject.next(
      payload?.nickname || 'User'
    );

    this.roleSubject.next(
      payload?.role || null
    );

    this.statusSubject.next(
      payload?.status || null
    );
  }

  private restoreSession(): void {

    if (this.getAccessToken()) {
      this.syncFromToken();
    }
  }

  private clearSession(): void {

    localStorage.clear();
    sessionStorage.clear();

    this.nicknameSubject.next('User');
    this.roleSubject.next(null);
    this.statusSubject.next(null);
  }

  getUser(): JwtPayload | null {
    return this.decodeToken();
  }

  getUserId(): number | null {
    return this.getUser()?.id ?? null;
  }

  getNickname(): string {
    return this.nicknameSubject.value;
  }

  getRole(): JwtPayload['role'] | null {
    return this.roleSubject.value;
  }

  getStatus(): JwtPayload['status'] | null {
    return this.statusSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getRefreshToken();
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
}