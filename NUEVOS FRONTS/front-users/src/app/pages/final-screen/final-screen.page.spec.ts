import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinalScreenPage } from './final-screen.page';

describe('FinalScreenPage', () => {
  let component: FinalScreenPage;
  let fixture: ComponentFixture<FinalScreenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
