import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuessSecretNumberPage } from './guess-secret-number.page';

describe('GuessSecretNumberPage', () => {
  let component: GuessSecretNumberPage;
  let fixture: ComponentFixture<GuessSecretNumberPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GuessSecretNumberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
