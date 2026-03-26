import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalScrenComponent } from './final-scren.component';

describe('FinalScrenComponent', () => {
  let component: FinalScrenComponent;
  let fixture: ComponentFixture<FinalScrenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalScrenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalScrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
