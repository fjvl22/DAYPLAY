import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuesssecretnumberComponent } from './guesssecretnumber.component';

describe('GuesssecretnumberComponent', () => {
  let component: GuesssecretnumberComponent;
  let fixture: ComponentFixture<GuesssecretnumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuesssecretnumberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuesssecretnumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
