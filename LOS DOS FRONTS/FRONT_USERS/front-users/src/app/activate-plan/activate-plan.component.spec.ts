import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatePlanComponent } from './activate-plan.component';

describe('ActivatePlanComponent', () => {
  let component: ActivatePlanComponent;
  let fixture: ComponentFixture<ActivatePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivatePlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivatePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
