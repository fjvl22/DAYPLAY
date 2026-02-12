import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MathrushComponent } from './mathrush.component';

describe('MathrushComponent', () => {
  let component: MathrushComponent;
  let fixture: ComponentFixture<MathrushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MathrushComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MathrushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
