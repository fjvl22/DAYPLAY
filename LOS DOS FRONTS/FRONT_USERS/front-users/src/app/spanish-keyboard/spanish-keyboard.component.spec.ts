import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpanishKeyboardComponent } from './spanish-keyboard.component';

describe('SpanishKeyboardComponent', () => {
  let component: SpanishKeyboardComponent;
  let fixture: ComponentFixture<SpanishKeyboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpanishKeyboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpanishKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
