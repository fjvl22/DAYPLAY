import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingUsersPage } from './pending-users.page';

describe('PendingUsersPage', () => {
  let component: PendingUsersPage;
  let fixture: ComponentFixture<PendingUsersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingUsersPage]
    }).compileComponents();

    fixture = TestBed.createComponent(PendingUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pending users list', () => {
    expect(component.pendingUsers).toBeDefined();
  });
});