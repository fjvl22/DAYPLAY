import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LettersKeyboardComponent } from './letters-keyboard.component';

describe('LettersKeyboardComponent', () => {
  let component: LettersKeyboardComponent;
  let fixture: ComponentFixture<LettersKeyboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LettersKeyboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LettersKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
