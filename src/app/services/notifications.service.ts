import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
   private apiUrl = `${environment.apiUrl}/notifications`; // tu backend NestJS
  
   //Estado compartido
  private notificationCountSubject = new BehaviorSubject<number>(0);
  notificationCount$ = this.notificationCountSubject.asObservable();

  private pendingCountSubject = new BehaviorSubject<number>(0);
  pendingCount$ = this.pendingCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getByUser(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}?userId=${userId}`);
  }
  getByUserPrediction(userId: number, predictionId:number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/${userId}/${predictionId}/find`);
  }
   // Actualizar los contadores globales
  setNotificationCount(count: number) {
    this.notificationCountSubject.next(count);
  }

  setPendingCount(count: number) {
    this.pendingCountSubject.next(count);
  }
  markAsRead(userId: number, predictionId:number): Observable<Notification> {
    return this.http.patch<Notification>(`${this.apiUrl}/${userId}/${predictionId}/read`, {});
  }
}







