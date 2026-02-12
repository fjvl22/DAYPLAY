import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private baseURL = 'http://localhost:3000/admin';
  constructor(private http: HttpClient){}
  getPendingUsers(): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseURL}/pending-users`);
  }
  approveUser(userId: number): Observable<any>{
    return this.http.post<any>(`${this.baseURL}/approve-user/${userId}`, {});
  }
}
