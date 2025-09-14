import { Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NotificationsService, Notification } from '../../services/notifications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  userInitials: string = '';
  userAvatarUrl: string = '';
  isProfileMenuOpen = false;
  profileMenuId = 'profileMenu';
  profileMenuButtonId = 'profileMenuButton';
  //notificacion
  notifications: Notification[] = [];
  notificationCount = 0; // example; replace with real data when available
  showNotifications = false;
  userId!: number;

  @ViewChildren('menuItem') menuItems!: QueryList<ElementRef<HTMLElement>>;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  constructor(private notificationsService: NotificationsService, private elementRef: ElementRef, private router: Router) { }

  ngOnInit() {
    // Compute initials from a hypothetical user name; replace when integrating auth data
    const storedName = localStorage.getItem('user_name') || '';
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userId = user.id;
    }
    this.userInitials = this.computeInitials(storedName);
    this.userAvatarUrl = localStorage.getItem('user_avatar_url') || '';

    this.notificationsService.getByUser(this.userId).subscribe((data) => {
      this.notifications = data;
      this.notificationCount = data.filter((n) => !n.isRead).length;// contador de no leidas
      this.notificationsService.setNotificationCount(this.notificationCount);//exportar global 
    });
  }
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
  /*   markAsRead(id: number) {
      this.notificationsService.markAsRead(id).subscribe(() => {
        this.notifications = this.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        );
        this.notificationCount = this.notifications.filter((n) => !n.isRead).length;
      });
    } */

  ngOnDestroy(): void { }

  toggleProfileMenu(event?: MouseEvent) {
    event?.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    if (this.isProfileMenuOpen) {
      setTimeout(() => {
        const first = this.menuItems?.first?.nativeElement;
        first?.focus();
      });
    }
  }

  closeProfileMenu() {
    this.isProfileMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (!this.isProfileMenuOpen) return;
    const host = this.elementRef.nativeElement as HTMLElement;
    if (!host.contains(ev.target as Node)) {
      this.closeProfileMenu();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocKeydown(ev: KeyboardEvent) {
    if (!this.isProfileMenuOpen) return;
    if (ev.key === 'Escape') {
      this.closeProfileMenu();
    }
  }

  onMenuKeydown(ev: KeyboardEvent) {
    if (!this.isProfileMenuOpen) return;
    const items: HTMLElement[] = this.menuItems?.toArray().map(r => r.nativeElement as HTMLElement) || [];
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      const next = items[(currentIndex + 1) % items.length];
      next?.focus();
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      const prev = items[(currentIndex - 1 + items.length) % items.length];
      prev?.focus();
    } else if (ev.key === 'Tab') {
      // trap focus
      ev.preventDefault();
      if (ev.shiftKey) {
        const prev = items[(currentIndex - 1 + items.length) % items.length];
        prev?.focus();
      } else {
        const next = items[(currentIndex + 1) % items.length];
        next?.focus();
      }
    }
  }

  logout() {
    // Clear simple local data; integrate with real auth later
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  private computeInitials(fullName: string): string {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.charAt(0) || '';
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  }
}


