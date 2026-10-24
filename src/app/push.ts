import { computed, inject, signal, Service } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

export type PushState = 'unsupported' | 'blocked' | 'off' | 'on';

@Service()
export class Push {
  private swPush = inject(SwPush);
  private http = inject(HttpClient);

  private subscription = toSignal(this.swPush.subscription, { initialValue: null });
  private permission = signal<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default',
  );

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  readonly state = computed<PushState>(() => {
    if (!this.swPush.isEnabled) return 'unsupported';
    if (this.permission() === 'denied') return 'blocked';
    return this.subscription() ? 'on' : 'off';
  });

  async enable() {
    if (this.busy() || this.state() !== 'off') return;
    this.busy.set(true);
    this.error.set(null);

    try {
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: environment.vapidPublicKey,
      });

      try {
        await firstValueFrom(this.http.post(`${environment.apiUrl}/push/subscribe`, sub.toJSON()));
      } catch (err) {
        // Server never learned about it, so don't leave the UI saying "on"
        await this.swPush.unsubscribe().catch(() => {});
        throw err;
      }
    } catch {
      this.permission.set(Notification.permission);
      if (this.permission() !== 'denied') {
        this.error.set("Couldn't turn on reminders. Please try again.");
      }
    } finally {
      this.busy.set(false);
    }
  }

  async disable() {
    const sub = this.subscription();
    if (this.busy() || !sub) return;
    this.busy.set(true);
    this.error.set(null);

    try {
      const endpoint = sub.endpoint;
      await this.swPush.unsubscribe();
      // If this call fails, the server drops the dead subscription on its next 404/410 anyway
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/push/unsubscribe`, { endpoint }),
      ).catch(() => {});
    } catch {
      this.error.set("Couldn't turn off reminders. Please try again.");
    } finally {
      this.busy.set(false);
    }
  }
}
