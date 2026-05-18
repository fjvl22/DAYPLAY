import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentsPage } from './payments.page';
import { AdminService } from 'src/app/services/admin.service';
import { of } from 'rxjs';

describe('PaymentsPage', () => {

  let component: PaymentsPage;
  let fixture: ComponentFixture<PaymentsPage>;
  let adminSpy: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {

    adminSpy = jasmine.createSpyObj('AdminService', ['getPayments']);

    await TestBed.configureTestingModule({
      imports: [PaymentsPage],
      providers: [
        { provide: AdminService, useValue: adminSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentsPage);
    component = fixture.componentInstance;
  });

  it('should load payments', () => {

    adminSpy.getPayments.and.returnValue(of([
      { id: 1, amount: 10 }
    ]));

    component.ngOnInit();

    expect(adminSpy.getPayments).toHaveBeenCalled();
  });
});