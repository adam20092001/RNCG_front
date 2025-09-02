import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const STORAGE_KEY = 'notification_count';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private countSubject: BehaviorSubject<number>;

  constructor() {
    const stored = Number.parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    this.countSubject = new BehaviorSubject<number>(Number.isFinite(stored) ? stored : 0);
  }

  getCount$(): Observable<number> {
    return this.countSubject.asObservable();
  }

  getCount(): number {
    return this.countSubject.value;
  }

  setCount(newCount: number): void {
    const safe = Math.max(0, Math.floor(newCount));
    localStorage.setItem(STORAGE_KEY, String(safe));
    this.countSubject.next(safe);
  }

  increment(by: number = 1): void {
    this.setCount(this.getCount() + Math.max(1, Math.floor(by)));
  }

  clear(): void {
    this.setCount(0);
  }
}







