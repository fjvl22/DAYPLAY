import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MathRushPage } from './math-rush.page';

describe('MathRushPage', () => {
  let component: MathRushPage;
  let fixture: ComponentFixture<MathRushPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MathRushPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
