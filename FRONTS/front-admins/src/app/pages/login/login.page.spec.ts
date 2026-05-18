import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { of, throwError } from 'rxjs';

describe('LoginPage', () => {

  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {

    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginPage],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should call login service on valid submit', fakeAsync(() => {

    component.form.setValue({
      nickname: 'user',
      password: '1234'
    });

    authServiceSpy.login.and.returnValue(of({
      accessToken: 'token',
      refreshToken: 'refresh'
    }));

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith('user', '1234');
  }));

  it('should handle login error', fakeAsync(() => {

    component.form.setValue({
      nickname: 'user',
      password: 'wrong'
    });

    authServiceSpy.login.and.returnValue(
      throwError(() => new Error('Invalid credentials'))
    );

    component.onSubmit();
    tick();

    expect(component.error).toBeDefined();
  }));
});