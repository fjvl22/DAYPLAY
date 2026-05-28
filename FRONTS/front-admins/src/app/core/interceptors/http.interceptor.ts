import { HttpInterceptorFn } from "@angular/common/http";

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  const skipAuth = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh'
  ];

  if (skipAuth.some(url => req.url.includes(url))) {
    console.log('SKIP AUTH FOR:', req.url);
    return next(req);
  }

  const token =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('jwt');

  console.log('URL:', req.url);
  console.log('TOKEN FOUND:', token);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

    console.log('INTERCEPTOR RUNNING');
  console.log('REQUEST URL:', req.url);

  console.log('HEADERS SENT:', req.headers.get('Authorization'));

  return next(req);
};