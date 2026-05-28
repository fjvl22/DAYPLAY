import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { httpInterceptor } from './http.interceptor';

describe('HttpInterceptor', () => {

  let interceptor: any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should add Authorization header if token exists', () => {
    localStorage.setItem('token', 'fake-token');

    const req = new HttpRequest('GET', '/test');

    const next: HttpHandlerFn = (request) => {
      expect(request.headers.has('Authorization')).toBeTrue();
      expect(request.headers.get('Authorization')).toContain('fake-token');
      return {} as any;
    };

    interceptor = httpInterceptor(req, next);
  });

  it('should pass request without token', () => {
    localStorage.removeItem('token');

    const req = new HttpRequest('GET', '/test');

    const next: HttpHandlerFn = (request) => {
      expect(request.headers.has('Authorization')).toBeFalse();
      return {} as any;
    };

    httpInterceptor(req, next);
  });
});