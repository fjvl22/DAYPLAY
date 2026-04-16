import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, tap } from "rxjs";
import { LoginResponse } from "../interfaces/login-response";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = '/api/auth';

  private adminTypeSubject = new BehaviorSubject<string>(this.getAdminTypeFromToken());
  adminType$ = this.adminTypeSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(nickname: string, password: string): Observable<LoginResponse> {
    return this.http.post<any>(`${this.api}/login`, { nickname, password }).pipe(
      tap(res => {
        if (res?.token) {
          this.saveToken(res.token);
          this.updateAdminType();
        }
      })
    );
  }

  saveToken(token: string) {localStorage.setItem('token', token);}

  getToken(): string | null {return localStorage.getItem('token');}

  isLogged(): boolean {return !!this.getToken();}

  logout() {
    localStorage.clear();
    this.adminTypeSubject.next('');
    return this.http.post(`${this.api}/logout`, {});
  }

  private decode(): any {
    const token = this.getToken();
    if (!token) return null;
    try {return JSON.parse(atob(token.split('.')[1]))} catch {return null;}
  }

  getNickname(): string {return this.decode()?.nickname || 'User';}

  getAdminType(): string {return this.decode()?.adminType || '';}

  private getAdminTypeFromToken(): string {return this.getAdminType();}

  updateAdminType() {this.adminTypeSubject.next(this.getAdminType());}
}