import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseGamePage } from './choose-game.page';

describe('ChooseGamePage', () => {
  let component: ChooseGamePage;
  let fixture: ComponentFixture<ChooseGamePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
