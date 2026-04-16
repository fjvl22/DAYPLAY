import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceDetailDialogComponent } from './trace-detail.dialog.component';

describe('TraceDetailDialogComponent', () => {
  let component: TraceDetailDialogComponent;
  let fixture: ComponentFixture<TraceDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraceDetailDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TraceDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
