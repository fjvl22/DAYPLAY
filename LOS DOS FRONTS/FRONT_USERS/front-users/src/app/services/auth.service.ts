import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoginResponse } from "../interfaces/login-response";
import { MessageResponse } from "../interfaces/message-response";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  login(nickname: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, { nickname, password });
  }

  register(nickname: string, password: string, email: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.API_URL}/register/user`, { nickname, password, email });
  }

  logout(): Observable<MessageResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<MessageResponse>(`${this.API_URL}/logout`, {}, { headers });
  }

  deleteAccount(password: string): Observable<MessageResponse> {
    const headers = this.getAuthHeaders();
    return this.http.delete<MessageResponse>(`${this.API_URL}/delete-account`, {headers, body: { password }});
  }

  changePassword(currentPassword: string, newPassword: string): Observable<MessageResponse> {
    const headers = this.getAuthHeaders();
    return this.http.put<MessageResponse>(
      `${this.API_URL}/change-password`,
      { currentPassword, newPassword },
      { headers }
    );
  }
}