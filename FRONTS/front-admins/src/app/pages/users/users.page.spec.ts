import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersPage } from './users.page';
import { AdminService } from 'src/app/services/admin.service';
import { of } from 'rxjs';

describe('UsersPage', () => {

  let component: UsersPage;
  let fixture: ComponentFixture<UsersPage>;
  let adminSpy: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {

    adminSpy = jasmine.createSpyObj('AdminService', ['getUsers']);

    await TestBed.configureTestingModule({
      imports: [UsersPage],
      providers: [
        { provide: AdminService, useValue: adminSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersPage);
    component = fixture.componentInstance;
  });

  it('should load users on init', () => {

    adminSpy.getUsers.and.returnValue(of([
      { id: 1, nickname: 'user1' }
    ]));

    component.ngOnInit();

    expect(adminSpy.getUsers).toHaveBeenCalled();
  });

  it('should render users in template', () => {

    adminSpy.getUsers.and.returnValue(of([
      { id: 1, nickname: 'user1' }
    ]));

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('user1');
  });
});