import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingUsersPage } from './pending-users.page';

describe('PendingUsersPage', () => {
  let component: PendingUsersPage;
  let fixture: ComponentFixture<PendingUsersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
