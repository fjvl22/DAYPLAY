import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';

describe('RegisterPage', () => {

  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {

    authSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterPage],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register user', fakeAsync(() => {

    component.form.setValue({
      nickname: 'test',
      email: 'test@test.com',
      password: '1234'
    });

    authSpy.register.and.returnValue(of({ success: true }));

    component.onSubmit();
    tick();

    expect(authSpy.register).toHaveBeenCalled();
  }));
});