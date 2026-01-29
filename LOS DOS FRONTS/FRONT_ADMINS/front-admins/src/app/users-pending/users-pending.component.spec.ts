import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPendingComponent } from './users-pending.component';

describe('UsersPendingComponent', () => {
  let component: UsersPendingComponent;
  let fixture: ComponentFixture<UsersPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersPendingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
