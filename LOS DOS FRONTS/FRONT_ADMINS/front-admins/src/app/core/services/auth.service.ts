import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterPayload } from '../interfaces/register-payload';
import { ChangePasswordPayload } from '../interfaces/change-password-payload';
import { LoginResponse } from '../interfaces/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  login(nickname: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, { nickname, password });
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

  getAdminType(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.adminType || '';
    } catch {
      return '';
    }
  }

  logout() {
    localStorage.clear();
    return this.http.post(`${this.api}/logout`, {});
  }

  register(data: RegisterPayload): Observable<any> {
    return this.http.post(`${this.api}/register/admin`, data);
  }

  changePassword(payload: ChangePasswordPayload): Observable<any> {
    return this.http.post(`${this.api}/change-password`, payload);
  }

  deleteAccount(password: string): Observable<any> {
    return this.http.delete(`${this.api}/delete-account`, {
      body: { password }
    });
  }
}