import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, tap } from "rxjs";
import { LoginResponse } from "../interfaces/login-response";
import { RegisterResponse } from "../interfaces/register-response";
import { MessageResponse } from "../interfaces/message-response";
import { ChangePasswordPayload } from "../interfaces/change-password-payload";
import { RegisterPayload } from "../interfaces/register-payload";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = '/api/auth';

  private adminTypeSubject = new BehaviorSubject<string>(this.getAdminTypeFromToken());
  adminType$ = this.adminTypeSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(nickname: string, password: string, rememberMe: boolean): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, { nickname, password, rememberMe }).pipe(
      tap(res => {
        this.saveAccessToken(res.accessToken);
        this.saveRefreshToken(res.refreshToken, rememberMe);
        this.updateAdminType();
      })
    );
  }
  
  register(data: RegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.api}/register/admin`, data);
  }

  logout(): Observable<MessageResponse> {
    const req = this.http.post<MessageResponse>(`${this.api}/logout`, {});
    this.clearSession();
    return req;
  }

  deleteAccount(password: string): Observable<MessageResponse> {
    return this.http.request<MessageResponse>('delete', `${this.api}/delete-account`, { body: { password } });
  }

  changePassword(data: ChangePasswordPayload): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`${this.api}/change-password`, data);
  }

  saveAccessToken(token: string) {
    sessionStorage.setItem('accessToken', token);
  }
  
  saveRefreshToken(token: string, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem('refreshToken', token);
    } else {
      sessionStorage.setItem('refreshToken', token);
    }
  }
  
  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken') 
        || sessionStorage.getItem('refreshToken');
  }

  isLogged(): boolean {
    return !!this.getRefreshToken();
  }

  private clearSession() {
    localStorage.clear();
    sessionStorage.clear();
    this.adminTypeSubject.next('');
  }

  private decode(): any {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  getNickname(): string {
    return this.decode()?.nickname || 'User';
  }

  getAdminType(): string {
    return this.decode()?.adminType || '';
  }

  private getAdminTypeFromToken(): string {
    return this.getAdminType();
  }

  updateAdminType() {
    this.adminTypeSubject.next(this.getAdminType());
  }
}