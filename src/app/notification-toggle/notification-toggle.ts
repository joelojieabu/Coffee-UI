import { Component, computed, inject } from '@angular/core';
import { Push } from '../push';

@Component({
  selector: 'app-notification-toggle',
  template: `
    <section class="card">
      <div class="text">
        <h2>Coffee reminders</h2>
        <p class="status" [class.muted]="push.state() !== 'on'">{{ statusText() }}</p>
      </div>

      @if (push.state() === 'on' || push.state() === 'off') {
        <button
          type="button"
          class="switch"
          role="switch"
          aria-label="Coffee reminders"
          [attr.aria-checked]="push.state() === 'on'"
          [class.on]="push.state() === 'on'"
          [disabled]="push.busy()"
          (click)="toggle()"
        >
          <span class="knob"></span>
        </button>
      }
    </section>

    @if (push.error(); as err) {
      <p class="error" role="alert">{{ err }}</p>
    }
  `,
  styles: `
    :host {
      display: block;
      max-width: 420px;
    }

    .card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: #f5e6d3;
      color: #3b2314;
      border-radius: 16px;
    }

    h2 {
      margin: 0 0 0.15rem;
      font-size: 1.05rem;
    }
    .status {
      margin: 0;
      font-size: 0.9rem;
      color: #5a3a24;
    }
    .status.muted {
      color: #7a5237;
    }

    .switch {
      position: relative;
      flex: none;
      width: 52px;
      height: 30px;
      border: 0;
      border-radius: 999px;
      background: #c9b49d;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    .switch.on {
      background: #3b2314;
    }
    .switch:disabled {
      opacity: 0.6;
      cursor: progress;
    }
    .switch:focus-visible {
      outline: 3px solid #f2c48d;
      outline-offset: 2px;
    }

    .knob {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #fff;
      transition: transform 0.2s ease;
    }
    .switch.on .knob {
      transform: translateX(22px);
    }

    .error {
      margin: 0.5rem 0 0;
      color: #b3261e;
      font-size: 0.875rem;
    }

    @media (prefers-reduced-motion: reduce) {
      .switch,
      .knob {
        transition: none;
      }
    }
  `,
})
export class NotificationToggle {
  protected push = inject(Push);

  protected statusText = computed(() => {
    if (this.push.busy()) return 'Working…';
    switch (this.push.state()) {
      case 'on':
        return "On. You'll get a nudge at your best coffee time.";
      case 'off':
        return 'Off. Turn on to get a nudge at your best coffee time.';
      case 'blocked':
        return 'Blocked in your browser settings. Allow notifications for this site, then come back.';
      case 'unsupported':
        return 'Not available here. Install the app and open it over HTTPS (or localhost) to enable reminders.';
    }
  });

  protected toggle() {
    if (this.push.state() === 'on') this.push.disable();
    else this.push.enable();
  }
}
