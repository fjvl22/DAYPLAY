import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyRewardsComponent } from './daily-rewards.component';

describe('DailyRewardsComponent', () => {
  let component: DailyRewardsComponent;
  let fixture: ComponentFixture<DailyRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyRewardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailyRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
