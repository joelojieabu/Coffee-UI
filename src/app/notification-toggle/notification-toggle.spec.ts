import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationToggle } from './notification-toggle';

describe('NotificationToggle', () => {
  let component: NotificationToggle;
  let fixture: ComponentFixture<NotificationToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationToggle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
