import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterKeyboardComponent } from './letter-keyboard.component';

describe('LetterKeyboardComponent', () => {
  let component: LetterKeyboardComponent;
  let fixture: ComponentFixture<LetterKeyboardComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
