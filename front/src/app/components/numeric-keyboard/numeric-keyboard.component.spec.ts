import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericKeyboardComponent } from './numeric-keyboard.component';

describe('NumericKeyboardComponent', () => {
  let component: NumericKeyboardComponent;
  let fixture: ComponentFixture<NumericKeyboardComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NumericKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
