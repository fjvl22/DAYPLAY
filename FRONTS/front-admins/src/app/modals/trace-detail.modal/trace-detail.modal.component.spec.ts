import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TraceDetailModalComponent } from './trace-detail.modal.component';

describe('TraceDetailModalComponent', () => {
  let component: TraceDetailModalComponent;
  let fixture: ComponentFixture<TraceDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TraceDetailModalComponent],
      imports: [IonicModule.forRoot()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TraceDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
