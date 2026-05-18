import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsPage } from './notifications.page';
import { AdminService } from 'src/app/services/admin.service';
import { of } from 'rxjs';

describe('NotificationsPage', () => {

  let component: NotificationsPage;
  let fixture: ComponentFixture<NotificationsPage>;
  let adminSpy: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {

    adminSpy = jasmine.createSpyObj('AdminService', ['getNotifications']);

    await TestBed.configureTestingModule({
      imports: [NotificationsPage],
      providers: [
        { provide: AdminService, useValue: adminSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsPage);
    component = fixture.componentInstance;
  });

  it('should load notifications', () => {

    adminSpy.getNotifications.and.returnValue(of([
      { id: 1, title: 'test' }
    ]));

    component.ngOnInit();

    expect(adminSpy.getNotifications).toHaveBeenCalled();
  });
});