import { Component, AfterViewInit, Directive, ElementRef } from '@angular/core';
@Directive({ selector: '[appReveal]' })
export class RevealDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}
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
export class HomeComponent {}
