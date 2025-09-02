import { Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  notificationCount = 3; // example; replace with real data when available
  userInitials: string = '';
  userAvatarUrl: string = '';
  isProfileMenuOpen = false;
  profileMenuId = 'profileMenu';
  profileMenuButtonId = 'profileMenuButton';

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

  constructor(private notificationsService: NotificationsService, private elementRef: ElementRef, private router: Router) {}

  ngOnInit() {
    // Compute initials from a hypothetical user name; replace when integrating auth data
    const storedName = localStorage.getItem('user_name') || '';
    this.userInitials = this.computeInitials(storedName);
    this.userAvatarUrl = localStorage.getItem('user_avatar_url') || '';

    this.notificationsService.getCount$().subscribe((count) => {
      this.notificationCount = count;
    });
  }

  ngOnDestroy(): void {}

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
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_avatar_url');
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
