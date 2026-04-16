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

  login(nickname: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, { nickname, password }).pipe(
      tap(res => {
        this.saveToken(res.token);
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
    return this.http.request<MessageResponse>('delete', `${this.api}/delete-account`, {body: { password }});
  }

  changePassword(data: ChangePasswordPayload): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`${this.api}/change-password`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  private clearSession() {
    localStorage.clear();
    this.adminTypeSubject.next('');
  }

  private decode(): any {
    const token = this.getToken();
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