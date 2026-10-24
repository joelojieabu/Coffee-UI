import { Component, inject, signal } from '@angular/core';
import { Push } from './push';
import { NotificationToggle } from './notification-toggle/notification-toggle';

@Component({
  imports: [NotificationToggle],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private push = inject(Push);
  protected readonly title = signal('coffee-ui');

  callPush() {
    this.push.enable();
  }
}
