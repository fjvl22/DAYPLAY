import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRegisterPage } from './admin-register.page';

describe('AdminRegisterPage', () => {
  let component: AdminRegisterPage;
  let fixture: ComponentFixture<AdminRegisterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
