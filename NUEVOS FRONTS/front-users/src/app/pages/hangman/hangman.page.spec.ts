import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HangmanPage } from './hangman.page';

describe('HangmanPage', () => {
  let component: HangmanPage;
  let fixture: ComponentFixture<HangmanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HangmanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
