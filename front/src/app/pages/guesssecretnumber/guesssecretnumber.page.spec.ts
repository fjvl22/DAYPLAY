import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuesssecretnumberPage } from './guesssecretnumber.page';

describe('GuesssecretnumberPage', () => {
  let component: GuesssecretnumberPage;
  let fixture: ComponentFixture<GuesssecretnumberPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GuesssecretnumberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
