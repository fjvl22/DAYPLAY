import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyRewardsPage } from './daily-rewards.page';

describe('DailyRewardsPage', () => {
  let component: DailyRewardsPage;
  let fixture: ComponentFixture<DailyRewardsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyRewardsPage]
    }).compileComponents();

    fixture = TestBed.createComponent(DailyRewardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have rewards list', () => {
    expect(component.rewards).toBeDefined();
  });
});