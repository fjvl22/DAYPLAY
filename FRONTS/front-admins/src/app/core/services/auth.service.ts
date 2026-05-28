import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";

import { environment } from "src/environments/environment";

import { LoginResponse } from "../interfaces/login-response";
import { LoginPayload } from "../interfaces/login-payload";
import { ChangePasswordPayload } from "../interfaces/change-password-payload";
import { RegisterPayload } from "../interfaces/register-payload";
import { RegisterResponse } from "../interfaces/register-response";

import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  nickname?: string;
  department?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = `${environment.apiUrl}/auth`;

  private nicknameSubject = new BehaviorSubject<string>('User');
  nickname$ = this.nicknameSubject.asObservable();

  private departmentSubject = new BehaviorSubject<string>('');
  department$ = this.departmentSubject.asObservable();

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  register(payload: RegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.API_URL}/register/admin`,
      payload
    );
  }

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.API_URL}/login`,
      payload
    ).pipe(
      tap((res) => {
        localStorage.setItem('accessToken', res.accessToken);
        this.syncFromToken();
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.API_URL}/logout`,
      {}
    ).pipe(
      tap(() => this.clearSession())
    );
  }

  changePassword(payload: ChangePasswordPayload): Observable<any> {
    return this.http.put(
      `${this.API_URL}/change-password`,
      payload
    );
  }

  deleteAccount(password: string): Observable<any> {
    return this.http.delete(
      `${this.API_URL}/delete-account`,
      {
        body: { password }
      }
    );
  }

  getAccessToken(): string | null {
    const token = localStorage.getItem('accessToken');

    return token && token !== 'undefined'
      ? token
      : null;
  }

  isLogged(): boolean {
    return !!this.getAccessToken();
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

    this.nicknameSubject.next(payload?.nickname || 'User');
    this.departmentSubject.next(payload?.department || '');
  }

  private restoreSession(): void {
    if (this.isLogged()) {
      this.syncFromToken();
    }
  }

  private clearSession(): void {
    localStorage.removeItem('accessToken');

    this.nicknameSubject.next('User');
    this.departmentSubject.next('');
  }

  getNickname(): string {
    return this.nicknameSubject.value;
  }

  getDepartment(): string {
    return this.departmentSubject.value;
  }
}