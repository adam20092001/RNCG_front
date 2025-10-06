import { Component, AfterViewInit, Directive, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NotificationsService, Notification } from '../../services/notifications.service';
@Directive({ selector: '[appReveal]' })
export class RevealDirective implements AfterViewInit {
  constructor(private el: ElementRef) { }
  ngAfterViewInit(): void {
    const element = this.el.nativeElement as HTMLElement;
    const onIntersect: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          element.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    };
    const observer = new IntersectionObserver(onIntersect, { threshold: 0.15 });
    observer.observe(element);
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  pendingCount = 0;
  summary: any = { notifications: 0, pending: 0 };
  notifications: Notification[] = [];
  contadoralertas=0

  constructor(private http: HttpClient, private notificationsService: NotificationsService) { }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.http.get<{ pendingCount: number }>(`${environment.apiUrl}/predictions/pending/count/${user.id}`)
        .subscribe(res => {
          this.pendingCount = res.pendingCount;
          this.notificationsService.setPendingCount(res.pendingCount);
        });
      this.http.get<{contadoralertas: number}>(`${environment.apiUrl}  `)
      this.notificationsService.getByUser(user.id).subscribe(list => {
        const unread = list.filter(n => !n.isRead);
        this.notifications = unread;
        this.notificationsService.setNotificationCount(unread.length);
      });
    }
    this.notificationsService.notificationCount$.subscribe(n => {
      this.summary.notifications = n;
    });
    this.notificationsService.pendingCount$.subscribe(p => {
      this.summary.pending = p;
    });
  }
}
