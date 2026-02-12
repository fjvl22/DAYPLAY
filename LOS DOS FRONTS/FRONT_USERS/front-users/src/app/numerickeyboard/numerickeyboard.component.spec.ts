import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumerickeyboardComponent } from './numerickeyboard.component';

describe('NumerickeyboardComponent', () => {
  let component: NumerickeyboardComponent;
  let fixture: ComponentFixture<NumerickeyboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumerickeyboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NumerickeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
