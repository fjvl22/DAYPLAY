import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { roleGuard } from './role.guard';

describe('roleGuard', () => {

  let executeGuard: CanActivateFn;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    executeGuard = (...params) =>
      TestBed.runInInjectionContext(() => roleGuard(...params));
  });

  it('should allow access for correct role', () => {
    localStorage.setItem('role', 'ADMIN');

    const result = executeGuard(
      {} as any,
      {} as any
    );

    expect(result).toBeTrue();
  });

  it('should block access for wrong role', () => {
    localStorage.setItem('role', 'USER');

    const result = executeGuard(
      {} as any,
      {} as any
    );

    expect(result).toBeFalse();
  });
});